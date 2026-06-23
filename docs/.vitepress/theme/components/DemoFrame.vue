<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';

withDefaults(defineProps<{
  title?: string;
  description?: string;
  linkText?: string;
}>(), {
  title: 'Interactive Demo',
  description: 'The embedded app is built from the same Vue 2 demo used for local development.',
  linkText: 'Open standalone demo',
});

const demoUrl = computed(() => withBase('/demo/'));
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
    <iframe
      class="demo-embed__frame"
      :src="demoUrl"
      title="vue-track-plush demo"
      loading="lazy"
    />
  </div>
</template>
