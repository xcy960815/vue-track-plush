<template>
  <section class="case-page">
    <h2>点击埋点</h2>

    <div class="case-block">
      <h3>指令点击：对象参数</h3>
      <button
        v-track:click
        :track-params="{
          buttonName: '指令点击上报(参数是对象)',
          routeName: 'click',
          caseName: 'directive-object',
        }"
      >
        指令点击上报(参数是对象)
      </button>
    </div>

    <div class="case-block">
      <h3>指令点击：字符串参数</h3>
      <button v-track:click track-params="指令点击上报(参数是字符串)">
        指令点击上报(参数是字符串)
      </button>
    </div>

    <div class="case-block">
      <h3>自定义点击</h3>
      <button @click="customClickReport">自定义点击上报</button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

import { clickEvent } from '../../plugin';
import { createDemoTrackConfig } from '../demo-config';

export default Vue.extend({
  name: 'ClickCase',
  methods: {
    customClickReport() {
      clickEvent(
        createDemoTrackConfig({
          buttonName: '按钮名称',
          routeName: 'click',
          caseName: 'custom-click',
          param1: '参数1',
          param2: '参数2',
        }),
      );
    },
  },
});
</script>
