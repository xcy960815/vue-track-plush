<template>
  <article class="case-page" v-track:browse="{ pageName: '手动上报测试页', routeName: 'manual' }">
    <header class="case-header">
      <h2>手动上报</h2>
      <p>测试 clickEvent、browseEvent 和 exposureEvent 三个导出方法。</p>
    </header>

    <section class="case-panel">
      <button type="button" @click="customClickReport">自定义点击上报</button>
      <button type="button" @click="customBrowseReport">自定义浏览上报</button>
      <button type="button" @click="customExposureReport">自定义曝光上报</button>
    </section>
  </article>
</template>

<script lang="ts">
import Vue from 'vue';

import { browseEvent, clickEvent, exposureEvent } from '../../plugin';
import { createDemoTrackConfig } from '../demo-config';

export default Vue.extend({
  name: 'ManualCase',
  methods: {
    customClickReport() {
      clickEvent(createDemoTrackConfig({
        buttonName: '自定义点击按钮',
        routeName: 'manual',
      }));
    },
    customBrowseReport() {
      browseEvent(createDemoTrackConfig({
        pageName: '自定义浏览页面',
        routeName: 'manual',
      }));
    },
    customExposureReport() {
      exposureEvent(createDemoTrackConfig({
        exposureName: '自定义曝光区域',
        routeName: 'manual',
      }));
    },
  },
});
</script>
