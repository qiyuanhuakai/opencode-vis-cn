<template>
  <div class="content-viewer-root">
    <div v-if="showModeTabs" class="viewer-tabs">
      <button
        v-for="mode in availableModes"
        :key="mode.id"
        type="button"
        class="viewer-tab"
        :class="{ active: mode.id === activeMode }"
        @click="activeMode = mode.id"
      >
        {{ mode.label }}
      </button>
    </div>
    <div class="viewer-body">
      <ImageRenderer v-if="activeMode === 'image'" :src="imageSrc || ''" :alt="imageAlt" />
      <MarkdownRenderer
        v-else-if="activeMode === 'rendered'"
        :code="fileContent || ''"
        lang="markdown"
        :theme="theme"
        @rendered="emit('rendered')"
      />
      <HexRenderer v-else-if="activeMode === 'hex'" :raw-html="rawHtml" />
      <CodeRenderer
        v-else
        :path="path"
        :raw-html="rawHtml"
        :file-content="fileContent"
        :lang="lang"
        :is-binary="isBinary"
        :gutter-mode="gutterMode"
        :theme="theme"
        :lines="lines"
        @rendered="emit('rendered')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CodeRenderer from '../renderers/CodeRenderer.vue';
import HexRenderer from '../renderers/HexRenderer.vue';
import ImageRenderer from '../renderers/ImageRenderer.vue';
import MarkdownRenderer from '../renderers/MarkdownRenderer.vue';

type ModeId = 'rendered' | 'source' | 'image' | 'hex';

const props = defineProps<{
  path?: string;
  rawHtml?: string;
  fileContent?: string;
  lang?: string;
  isBinary?: boolean;
  gutterMode?: 'default' | 'none' | 'grep-source';
  theme?: string;
  lines?: string;
  imageSrc?: string;
  imageAlt?: string;
}>();

const emit = defineEmits<{
  (event: 'rendered'): void;
}>();

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg']);

const isMarkdown = computed(() => {
  if (props.lang === 'markdown') return true;
  const ext = props.path?.split('.').pop()?.toLowerCase();
  return ext === 'md' || ext === 'markdown';
});

const isImagePath = computed(() => {
  const ext = props.path?.split('.').pop()?.toLowerCase();
  if (!ext) return false;
  return IMAGE_EXTENSIONS.has(ext);
});

const availableModes = computed<Array<{ id: ModeId; label: string }>>(() => {
  if (props.imageSrc) {
    const modes: Array<{ id: ModeId; label: string }> = [{ id: 'image', label: 'Image' }];
    if (props.rawHtml) modes.push({ id: 'hex', label: 'Hex' });
    return modes;
  }
  if (props.isBinary || isImagePath.value) {
    return [{ id: 'hex', label: 'Hex' }];
  }
  if (isMarkdown.value && props.fileContent != null) {
    return [
      { id: 'rendered', label: 'Rendered' },
      { id: 'source', label: 'Source' },
    ];
  }
  return [{ id: 'source', label: 'Source' }];
});

const activeMode = ref<ModeId>('source');

watch(
  availableModes,
  (modes) => {
    const valid = modes.some((mode) => mode.id === activeMode.value);
    if (!valid && modes[0]) {
      activeMode.value = modes[0].id;
    }
  },
  { immediate: true },
);

const showModeTabs = computed(() => availableModes.value.length > 1);
</script>

<style scoped>
.content-viewer-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.viewer-tabs {
  display: flex;
  gap: 0;
  background: rgba(26, 29, 36, 0.95);
  border-bottom: 1px solid rgba(90, 100, 120, 0.35);
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
}

.viewer-tabs::-webkit-scrollbar {
  display: none;
}

.viewer-tab {
  border: 0;
  background: transparent;
  color: #8a8f9a;
  font-size: 11px;
  font-family: inherit;
  padding: 3px 10px;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.viewer-tab:hover {
  color: #cbd5e1;
}

.viewer-tab.active {
  color: #e2e8f0;
  border-bottom-color: #60a5fa;
}

.viewer-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
