<template>
  <div
    v-if="state.html"
    class="markdown-renderer message-viewer min-h-[1.2em] leading-[inherit] text-[inherit]"
    :class="{ 'no-copy': !copyButton }"
  >
    <div
      class="message-content leading-[inherit] text-[inherit]"
      v-html="state.html"
      @click="handleContentClick"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, watch } from 'vue';
import { renderWorkerHtml } from '../../utils/workerRenderer';

const props = defineProps<{
  code?: string;
  lang?: string;
  theme?: string;
  html?: string;
  files?: string[];
  copyButton?: boolean;
}>();

const emit = defineEmits<{
  (event: 'rendered'): void;
}>();

const state = reactive({
  html: '',
  requestId: 0,
});

const copiedResetTimers = new Map<HTMLElement, number>();

function resetCopyButtonState(codeBlock: HTMLElement) {
  codeBlock.classList.remove('copied');
}

function scheduleCopyButtonReset(codeBlock: HTMLElement) {
  const timerId = copiedResetTimers.get(codeBlock);
  if (timerId !== undefined) {
    window.clearTimeout(timerId);
  }
  const nextTimerId = window.setTimeout(() => {
    resetCopyButtonState(codeBlock);
    copiedResetTimers.delete(codeBlock);
  }, 1500);
  copiedResetTimers.set(codeBlock, nextTimerId);
}

async function handleContentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest('.md-copy-btn');
  if (!(button instanceof HTMLElement)) return;

  const codeBlock = button.closest('.md-code-block');
  if (codeBlock instanceof HTMLElement) {
    const pre = codeBlock.querySelector('pre');
    if (!pre) return;
    await navigator.clipboard.writeText(pre.textContent ?? '');
    codeBlock.classList.add('copied');
    scheduleCopyButtonReset(codeBlock);
    return;
  }

  const markdownHost = button.closest('.markdown-host');
  if (!(markdownHost instanceof HTMLElement)) return;
  const rawSource = markdownHost.querySelector('template.md-raw-source');
  if (!(rawSource instanceof HTMLTemplateElement)) return;
  await navigator.clipboard.writeText(rawSource.content.textContent ?? '');
  markdownHost.classList.add('copied');
  scheduleCopyButtonReset(markdownHost);
}

async function startRender() {
  const code = props.code ?? '';
  const lang = props.lang ?? 'text';
  const theme = props.theme ?? 'github-dark';
  const nextId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  state.requestId += 1;
  const current = state.requestId;
  await nextTick();
  renderWorkerHtml({
    id: nextId,
    code,
    lang,
    theme,
    gutterMode: 'none',
    files: props.files,
  })
    .then(async (html) => {
      if (current !== state.requestId) return;
      state.html = html;
      await nextTick();
      if (current !== state.requestId) return;
      emit('rendered');
    })
    .catch(async () => {
      if (current !== state.requestId) return;
      await nextTick();
      if (current !== state.requestId) return;
      emit('rendered');
    });
}

watch(
  () => props.html,
  async (newHtml) => {
    if (newHtml == null) return;
    state.requestId += 1;
    state.html = newHtml;
    await nextTick();
    emit('rendered');
  },
  { immediate: true },
);

watch(
  () => [props.code, props.lang, props.theme, props.files],
  () => {
    if (props.html != null) return;
    startRender();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  state.requestId += 1;
  copiedResetTimers.forEach((timerId) => {
    window.clearTimeout(timerId);
  });
  copiedResetTimers.clear();
});
</script>

<style scoped>
.message-viewer.no-copy :deep(.md-copy-btn),
.message-viewer.no-copy :deep(.md-copied-indicator) {
  display: none !important;
}

.message-content :deep(pre.shiki),
.message-content :deep(pre.shiki > code) {
  margin: 0;
  padding: 0;
  background: transparent !important;
  background-color: transparent !important;
  line-height: inherit !important;
  font-family: inherit;
  font-size: inherit;
}

.message-content :deep(.code-gutter) {
  display: none;
}

.message-content :deep(.line) {
  display: inline;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.message-content :deep(.markdown-host .md-copy-btn),
.message-content :deep(.markdown-host .md-copied-indicator) {
  position: absolute;
  top: 0.75em;
  right: 0.75em;
}
</style>
