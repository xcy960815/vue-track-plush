<template>
  <div class="vue-track-plush">
    <h3>vue-track-plush-demo</h3>

    <div class="button-box" v-track:browse :track-params="{ name: 'testName', pageName: 'pageName' }">
      <button
        v-track:click
        :track-params="{
          buttonName: '指令点击上报(参数是对象)',
          param1: 'param1',
          param2: 'param2',
        }"
      >
        指令点击上报(参数是对象)
      </button>
    </div>

    <div class="button-box" v-track:browse track-params="example">
      <button v-track:click track-params="指令点击上报(参数是字符串)">
        指令点击上报(参数是字符串)
      </button>
    </div>

    <div
      class="button-box exposure-box"
      v-track:exposure
      :track-params="{ areaName: '曝光埋点区域', module: 'demo' }"
    >
      曝光埋点区域
    </div>

    <div class="button-box">
      <button @click="customClickReport">自定义点击上报</button>
    </div>

    <div class="button-box">
      <button @click="customBrowseReport">自定义浏览上报</button>
    </div>

    <div class="button-box">
      <button @click="customExposureReport">自定义曝光上报</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { browseEvent, clickEvent, exposureEvent } from '../plugin';

export default Vue.extend({
  name: 'App',
  methods: {
    customClickReport() {
      clickEvent({
        baseURL: window.location.origin,
        url: '/track-api',
        projectName: '测试开发',
        buttonName: '按钮名称',
        param1: '参数1',
        param2: '参数2',
        paramN: '参数n',
      });
    },
    customBrowseReport() {
      browseEvent({
        baseURL: window.location.origin,
        url: '/track-api',
        projectName: '测试开发',
        pageName: '页面名称',
        param1: '参数1',
        param2: '参数2',
        paramN: '参数n',
      });
    },
    customExposureReport() {
      exposureEvent({
        baseURL: window.location.origin,
        url: '/track-api',
        projectName: '测试开发',
        areaName: '自定义曝光区域',
        param1: '参数1',
        param2: '参数2',
      });
    },
  },
});
</script>

<style scoped lang="less">
.vue-track-plush {
  padding: 24px;
  font-family: Arial, sans-serif;
}

.button-box {
  margin-bottom: 10px;
}

.exposure-box {
  width: 220px;
  padding: 16px;
  border: 1px solid #4b8f8c;
  background: #eef8f7;
}
</style>
