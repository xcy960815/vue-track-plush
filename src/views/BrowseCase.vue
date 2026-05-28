<template>
  <section class="case-page">
    <h2>浏览埋点</h2>

    <div
      class="case-block"
      v-track:browse
      :track-params="{
        pageName: '浏览埋点对象参数页面块',
        routeName: 'browse',
        caseName: 'directive-object',
      }"
    >
      <h3>指令浏览：对象参数</h3>
      <p>进入当前路由并渲染该区域时触发浏览上报。</p>
    </div>

    <div class="case-block" v-track:browse track-params="浏览埋点字符串参数页面块">
      <h3>指令浏览：字符串参数</h3>
      <p>字符串参数会作为 pageName 上报。</p>
    </div>

    <div class="case-block">
      <h3>自定义浏览</h3>
      <button @click="customBrowseReport">自定义浏览上报</button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

import { browseEvent } from '../../plugin';
import { createDemoTrackConfig } from '../demo-config';

export default Vue.extend({
  name: 'BrowseCase',
  methods: {
    customBrowseReport() {
      browseEvent(
        createDemoTrackConfig({
          pageName: '页面名称',
          routeName: 'browse',
          caseName: 'custom-browse',
          param1: '参数1',
          param2: '参数2',
        }),
      );
    },
  },
});
</script>
