### vue-track-plush 一个基于 vue2 指令埋点的组件

[![npm](https://img.shields.io/npm/v/vue-track-plush.svg)](https://www.npmjs.com/package/vue-track-plush)
[![npm](https://img.shields.io/npm/dw/vue-track-plush.svg)](https://npmtrends.com/vue-track-plush)
[![npm](https://img.shields.io/npm/l/vue-track-plush.svg?sanitize=true)](https://www.npmjs.com/package/vue-track-plush)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

### 安装方法

```sh
npm install vue-track-plush -S
```

字段类型

```ts
export type TrackPlushConfig = {
  projectName: string; // 项目名称
  baseURL: string; // 埋点接口baseURL
  url: srting; // 埋点接口url
};
```

### 使用方法 (指令埋点)

```js
// main.js
import Vue from "vue";
import App from "./App";
Vue.config.productionTip = false;
// 植入埋点指令
import VueTrackPlush from "vue-track-plush";
Vue.use(VueTrackPlush, {
  baseURL: "<接口域名>",
  url: "<接口地址>",
  projectName: "项目名称",
});
new Vue({
  el: "#app",
  components: {
    App,
  },
  template: "<App/>",
});
```

### 使用方法 (点击埋点)

```html
<!-- xxx.vue -->
<template>
  <div class="vue-track-plush">
    <h3>vue-track-plush-demo</h3>

    <!-- 测试参数传递对象 -->
    <!-- 注意 如果自定义指令的参数是对象 则会结构当前的对象数据 进行数据上报  -->
    <div
      class="button-box"
      v-track:browse="{ name: 'testName', pageName: 'pageName' }"
    >
      <!-- 注意如果自定义指令的参数是对象 则会结构当前的对象数据 进行数据上报 -->
      <button
        v-track:click="{ 
              buttonName: '指令点击上(参数是对象)', 
              param1: 'param1', 
              param2: 'param2' 
          }"
      >
        指令点击上报(参数是对象)
      </button>
    </div>

    <!-- 测试参数传递字符串 -->
    <!-- 注意 如果自定义指令的参数是字符串 则会以pageName作为数据上报 -->
    <div class="button-box" v-track:browse="example">
      <!-- 注意 如果自定义指令的参数是字符串 则会以buttonName作为数据上报 -->
      <button v-track:click="指令点击上报(参数是字符串)">
        指令点击上报(参数是字符串)
      </button>
    </div>

    <div class="button-box">
      <button @click="customClickReport">自定义点击上报</button>
    </div>

    <div class="button-box">
      <button @click="customBrowseReport">自定义浏览上报</button>
    </div>
    <!-- 测试动态数据上报 -->
    <div class="button-box">
      <button @click="clickNumber++">动态修改上报数据</button> ===》{{
      clickNumber }}
      <button
        v-track:click="{
          buttonName: '点击的上报数据',
          currentNunber: clickNumber,
        }"
      >
        上报点击数据
      </button>
    </div>
    <div class="button-box">
      <button @click="browseNumber++">动态修改上报数据</button> ===》 {{
      browseNumber }}
      <button
        v-track:browse="{
          buttonName: '浏览的上报数据',
          currentNunber: browseNumber,
        }"
      >
        上报浏览数据
      </button>
    </div>
  </div>
</template>

<script>
  // 自定义埋点上报
  import { clickEvent, browseEvent } from "vue-track-plush";

  export default {
    data() {
      return {
        clickNumber: 0,
        browseNumber: 0,
        clickTrackParams: "click-track-params-before",
        browseTrackParams: "browse-track-params-before",
      };
    },
    mounted() {},
    methods: {
      // 自定义点击上报
      customClickReport() {
        clickEvent({
          baseURL: "<接口域名>",
          url: "<接口地址>",
          projectName: "项目名称",
          buttonName: "按钮名称",
          param1: "参数1",
          param2: "参数2",
          paramN: "参数n",
        });
      },
      // 自定义浏览上班
      customBrowseReport() {
        browseEvent({
          baseURL: "<接口域名>",
          url: "<接口地址>",
          projectName: "项目名称",
          pageName: "页面名称",
          param1: "参数1",
          param2: "参数2",
          paramN: "参数n",
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .button-box {
    margin-bottom: 10px;
  }
</style>
```
