<template>
  <section class="case-page">
    <h2>曝光埋点</h2>

    <div
      class="case-block exposure-box"
      v-track:exposure
      :track-params="{
        areaName: '首屏曝光区域',
        routeName: 'exposure',
        caseName: 'first-screen',
      }"
    >
      首屏曝光埋点区域
    </div>

    <div class="spacer">向下滚动查看延迟曝光区域</div>

    <div
      class="case-block exposure-box"
      v-track:exposure
      :track-params="{
        areaName: '滚动后曝光区域',
        routeName: 'exposure',
        caseName: 'scroll-into-view',
      }"
    >
      滚动后曝光埋点区域
    </div>

    <div class="case-block">
      <h3>自定义曝光</h3>
      <button @click="customExposureReport">自定义曝光上报</button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

import { exposureEvent } from '../../plugin';
import { createDemoTrackConfig } from '../demo-config';

export default Vue.extend({
  name: 'ExposureCase',
  methods: {
    customExposureReport() {
      exposureEvent(
        createDemoTrackConfig({
          areaName: '自定义曝光区域',
          routeName: 'exposure',
          caseName: 'custom-exposure',
          param1: '参数1',
          param2: '参数2',
        }),
      );
    },
  },
});
</script>

<style scoped lang="less">
.exposure-box {
  width: 240px;
  padding: 16px;
  border: 1px solid #4b8f8c;
  background: #eef8f7;
}

.spacer {
  height: 80vh;
  display: flex;
  align-items: center;
  color: #666;
}
</style>
