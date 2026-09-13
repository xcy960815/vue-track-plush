<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    linkText?: string;
  }>(),
  {
    title: 'Interactive Demo',
    description: 'The embedded app is built from the same Vue 2 demo used for local development.',
    linkText: 'Open standalone demo',
  },
);

const { isDark } = useData();

const demoUrl = computed(() => withBase(`/demo/?theme=${isDark.value ? 'dark' : 'light'}`));
</script>

<template>
  <div class="demo-embed">
    <div class="demo-embed__header">
      <div>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
      <a :href="demoUrl" target="_blank" rel="noreferrer">{{ linkText }}</a>
    </div>
    <!-- 预渲染阶段拿不到真实主题，ClientOnly 保证首帧 src 就带正确的 theme 参数 -->
    <ClientOnly>
      <iframe
        class="demo-embed__frame"
        :src="demoUrl"
        title="vue-track-plush demo"
        loading="lazy"
      />
    </ClientOnly>
  </div>
</template>
