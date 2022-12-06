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
    <h2 align="center">vue-track-plush 测试demo</h2>
    <div class="container">
      <div class="container-item">
        <h3 align="center">上报静态数据</h3>
        <h3>测试参数传递对象</h3>
        <div class="button-box" v-track:browse="{ pageName: '页面名称' }">
          <button v-track:click="{ buttonName: '按钮名称' }">
            指令点击上报(参数是对象)
          </button>
        </div>
        <h3>测试参数传递字符串</h3>
        <div class="button-box" v-track:browse="'页面名称'">
          <button v-track:click="'按钮名称'">指令点击上报(参数是字符串)</button>
        </div>
      </div>
      <div class="container-item">
        <h3 align="center">上报动态数据</h3>
        <h3>测试点击动态数据上报</h3>
        <div class="button-box">
          <button @click="clickParams++">动态修改上报点击数据</button> ===》{{
          clickParams }}
          <button
            v-track:click="{
              buttonName: '点击的上报数据',
              currentNumber: clickParams,
            }"
          >
            上报点击数据
          </button>
        </div>
        <h3>测试浏览动态数据上报</h3>
        <div class="button-box">
          <button @click="browseParams++">动态修改浏览上报数据</button> ===》 {{
          browseParams }}
          <button
            v-track:browse="{
              buttonName: '浏览的上报数据',
              currentNumber: browseParams,
            }"
          >
            上报浏览数据
          </button>
        </div>
      </div>
      <div class="container-item">
        <h3 align="center">自定义上报数据</h3>
        <h3>自定义点击上报</h3>
        <div class="button-box">
          <button @click="customClickReport">自定义点击上报</button>
          {{ clickNumber }}
        </div>
        <h3>自定义浏览上报</h3>
        <div class="button-box">
          <button @click="customBrowseReport">自定义浏览上报</button>
          {{ browseNumber }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 自定义埋点上报
  import { clickEvent, browseEvent } from "vue-track-plush";

  export default {
    data() {
      return {
        browseParams: 0,
        clickParams: 0,
        clickNumber: 0,
        browseNumber: 0,
      };
    },

    methods: {
      // 自定义点击上报
      customClickReport() {
        clickEvent({
          baseURL: "host",
          url: "/api/action/record",
          projectName: "测试开发",
          buttonName: "按钮名称",
          param1: "参数1",
          param2: "参数2",
          paramN: "参数n",
          clickNumber: this.clickNumber,
        });
        this.clickNumber++;
      },
      // 自定义浏览上报
      customBrowseReport() {
        browseEvent({
          baseURL: "host",
          url: "/api/action/record",
          projectName: "测试开发",
          pageName: "页面名称",
          param1: "参数1",
          param2: "参数2",
          paramN: "参数n",
          browseNumber: this.browseNumber,
        });
        this.browseNumber++;
      },
    },
  };
</script>

<style scoped lang="less">
  .container {
    display: flex;
    .container-item {
      padding: 10px 20px;
      flex: 1;
      margin: 0 20px;
      .button-box {
        margin-bottom: 10px;
        background-color: aqua;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        button {
          margin: 0 10px;
        }
      }
      &.container-item:nth-child(1) {
        background-color: bisque;
      }
      &.container-item:nth-child(2) {
        background-color: burlywood;
      }
      &.container-item:nth-child(3) {
        background-color: cadetblue;
      }
    }
  }
</style>
```
