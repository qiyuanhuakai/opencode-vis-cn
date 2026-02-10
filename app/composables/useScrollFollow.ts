import { ref, computed, watch, nextTick, onUnmounted, type Ref } from 'vue';

export type ScrollMode = 'follow' | 'force' | 'manual' | 'none';

const BOTTOM_THRESHOLD_PX = 8;
const SCROLL_SPEED_PX_PER_MS = 1.5;
const INTERVENTION_TOLERANCE_PX = 2;
const MAX_FRAME_DT_MS = 50;
const POPUP_DURATION_MS = 150;

export function useScrollFollow(
  containerEl: Ref<HTMLElement | undefined>,
  scrollMode: Ref<ScrollMode>,
) {
  const isFollowing = ref(scrollMode.value === 'follow' || scrollMode.value === 'force');

  let mutationObserver: MutationObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let rafId: number | null = null;
  let popupTimerId: ReturnType<typeof setTimeout> | null = null;
  let animating = false;
  let lastSetScrollTop = -1;
  let contentChangeScheduled = false;

  const showResumeButton = computed(() => {
    return scrollMode.value === 'follow' && !isFollowing.value;
  });

  function isAtBottom(el: HTMLElement): boolean {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD_PX;
  }

  function cancelAnimation() {
    animating = false;
    lastSetScrollTop = -1;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function scrollToBottom(smooth: boolean) {
    const el = containerEl.value;
    if (!el) return;
    const target = el.scrollHeight - el.clientHeight;
    if (target <= 0) return;
    if (Math.abs(el.scrollTop - target) < 1) return;

    if (!smooth) {
      cancelAnimation();
      el.scrollTop = target;
      lastSetScrollTop = target;
      return;
    }

    if (animating) return;

    animating = true;
    let lastTime = performance.now();
    lastSetScrollTop = el.scrollTop;

    function frame(now: number) {
      const el = containerEl.value;
      if (!el || !animating) {
        animating = false;
        return;
      }

      if (
        lastSetScrollTop >= 0 &&
        Math.abs(el.scrollTop - lastSetScrollTop) > INTERVENTION_TOLERANCE_PX
      ) {
        animating = false;
        lastSetScrollTop = -1;
        if (scrollMode.value === 'follow') {
          isFollowing.value = isAtBottom(el);
        }
        return;
      }

      const dt = Math.min(now - lastTime, MAX_FRAME_DT_MS);
      lastTime = now;
      const target = el.scrollHeight - el.clientHeight;
      const remaining = target - el.scrollTop;

      if (remaining <= 0.5) {
        el.scrollTop = target;
        lastSetScrollTop = target;
        animating = false;
        return;
      }

      const step = SCROLL_SPEED_PX_PER_MS * dt;
      const newTop = Math.min(el.scrollTop + step, target);
      el.scrollTop = newTop;
      lastSetScrollTop = newTop;

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
  }

  function scheduleAutoScroll(smooth: boolean) {
    if (contentChangeScheduled) return;
    contentChangeScheduled = true;
    requestAnimationFrame(() => {
      contentChangeScheduled = false;
      const m = scrollMode.value;
      if (m === 'force') {
        scrollToBottom(smooth);
      } else if (m === 'follow' && isFollowing.value) {
        scrollToBottom(smooth);
      }
    });
  }

  function onScroll() {
    if (animating) return;
    if (scrollMode.value !== 'follow') return;
    const el = containerEl.value;
    if (!el) return;
    isFollowing.value = isAtBottom(el);
  }

  function onContentMutation() {
    scheduleAutoScroll(true);
  }

  function onContainerResize() {
    const m = scrollMode.value;
    if (m === 'force' || (m === 'follow' && isFollowing.value)) {
      scrollToBottom(false);
    }
  }

  function resumeFollow() {
    isFollowing.value = true;
    scrollToBottom(true);
  }

  function startObserving(el: HTMLElement) {
    mutationObserver = new MutationObserver(onContentMutation);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    let resizeInitial = true;
    resizeObserver = new ResizeObserver(() => {
      if (resizeInitial) {
        resizeInitial = false;
        return;
      }
      onContainerResize();
    });
    resizeObserver.observe(el);

    if (scrollMode.value === 'follow' || scrollMode.value === 'force') {
      scrollToBottom(true);
    }
  }

  function setup(el: HTMLElement) {
    el.addEventListener('scroll', onScroll, { passive: true });

    popupTimerId = setTimeout(() => {
      popupTimerId = null;
      if (containerEl.value === el) startObserving(el);
    }, POPUP_DURATION_MS);
  }

  function teardown(el: HTMLElement) {
    el.removeEventListener('scroll', onScroll);
    if (popupTimerId !== null) {
      clearTimeout(popupTimerId);
      popupTimerId = null;
    }
    cancelAnimation();
    mutationObserver?.disconnect();
    mutationObserver = null;
    resizeObserver?.disconnect();
    resizeObserver = null;
  }

  watch(containerEl, (newEl, oldEl) => {
    if (oldEl) teardown(oldEl);
    if (newEl) setup(newEl);
  });

  watch(scrollMode, (m) => {
    isFollowing.value = m === 'follow' || m === 'force';
  });

  onUnmounted(() => {
    if (containerEl.value) teardown(containerEl.value);
    cancelAnimation();
  });

  return {
    isFollowing: computed(() => isFollowing.value),
    showResumeButton,
    resumeFollow,
    scrollToBottom,
  };
}
