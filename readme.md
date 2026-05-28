# vue-track-plush

一个基于 Vue 2 指令的埋点统计插件，支持点击、浏览、曝光事件，也支持自定义事件上报。

### 安装方法

```sh
pnpm add vue-track-plush
```

字段类型

```ts
export type TrackPlushConfig = {
  projectName: string; // 项目名称
  baseURL: string; // 埋点接口 baseURL
  url: string; // 埋点接口 url
  pageName?: string; // 页面名称，自定义浏览事件必填
  pageUrl?: string; // 页面 url，默认 window.location.href
  userAgent?: string; // 默认 navigator.userAgent
  method?: 'GET' | 'POST' | 'get' | 'post'; // 埋点接口请求方法，默认 POST
  buttonName?: string; // 点击事件按钮名称
  maxNum?: number; // 曝光批量上报最大数量，默认 20
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  retry?: number;
  retryDelay?: number;
  [key: string]: unknown;
}
```

### 使用方法 (指令埋点)

```js
// main.js
import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

// 植入埋点指令
import VueTrackPlush from "vue-track-plush"

Vue.use(VueTrackPlush, {
  baseURL: "<接口域名>",
  url: "<接口地址>",
  projectName: "项目名称"
})
new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
})

```

### 使用方法 (点击、浏览、曝光埋点)

```html
<!-- xxx.vue -->
<template>
    <div class="vue-track-plush">

        <h3>vue-track-plush-demo</h3>

        <!-- 测试参数传递对象 -->
        <div class="button-box" v-track:browse :track-params="{ name: 'testName', pageName: 'pageName' }">
            <button 
                v-track:click
                :track-params="{ 
                    buttonName: '指令点击上(参数是对象)', 
                    param1: 'param1', 
                    param2: 'param2' 
                }"
                >
                指令点击上报(参数是对象)
            </button>
        </div>

        <!-- 测试参数传递字符串 -->
        <div class="button-box" 
            v-track:browse 
            track-params="example"
        >
            <button 
                v-track:click 
                track-params="指令点击上报(参数是字符串)"
                >
                指令点击上报(参数是字符串)
            </button>
        </div>

        <div
            class="button-box"
            v-track:exposure
            :track-params="{ name: '曝光区域', id: 1 }"
        >
            曝光埋点区域
        </div>

        <div class="button-box">
            <button
                 @click="customExposureReport">
                 自定义曝光上报
            </button>
        </div>

        <div class="button-box">
            <button 
                @click="customClickReport">
                自定义点击上报
            </button>
        </div>

        <div class="button-box">
            <button
                 @click="customBrowseReport">
                 自定义浏览上报
            </button>
        </div>

    </div>
</template>

<script>
// 自定义埋点上报
import { clickEvent, browseEvent, exposureEvent } from "vue-track-plush"

export default {
    data() {
        return {};
    },
    mounted() { },
    methods: {
        // 自定义点击上报
        customClickReport() {
            clickEvent({
                baseURL: "<接口域名>",
                url: "<接口地址>",
                projectName:"项目名称",
                buttonName: "按钮名称",
                param1: "参数1",
                param2: "参数2",
                paramN: "参数n"
            })
        },
        // 自定义浏览上班
        customBrowseReport() {
            browseEvent({
                baseURL: "<接口域名>",
                url: "<接口地址>",
                projectName:"项目名称",
                pageName: "页面名称",
                param1: "参数1",
                param2: "参数2",
                paramN: "参数n"
            })
        },
        // 自定义曝光上报
        customExposureReport() {
            exposureEvent({
                baseURL: "<接口域名>",
                url: "<接口地址>",
                projectName:"项目名称",
                areaName: "曝光区域名称",
                param1: "参数1",
                param2: "参数2",
                paramN: "参数n"
            })
        }
    },
};
</script>

<style scoped lang="less">
.button-box {
    margin-bottom: 10px;
}
</style>

```

### 本地开发

```sh
pnpm install
pnpm dev
```

### 构建插件

```sh
pnpm build
```

构建产物：

- `dist/vue-track-plush.umd.js`
- `dist/vue-track-plush.esm.js`
- `types/vue-track-plush.d.ts`

### 构建 demo

```sh
pnpm build:demo
```

demo 构建产物输出到 `demo-dist`，不会覆盖插件产物。
