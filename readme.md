### vue-track-plush 一个基于 vue2 指令埋点的组件

### 安装方法

```sh
npm install vue-track-plush -S

OR

yarn add vue-track-plush
```

字段类型

```ts
export type TrackPlushConfig = {

    projectName: string, // 项目名称

    baseURL: string, // 埋点接口baseURL

    url: srting // 埋点接口url

    pageName?: string // 页面名称 自定义浏览事件必填

    pageUrl?: 页面url //页面url 默认 window.location.href

    userAgent?: UA // 默认 navigator.userAgent

    method?: "GET"|"POST" //埋 点接口的请求方法 默认POST

    buttonName?:string // 点击事件的按钮名称
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

### 使用方法 (点击埋点)
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
import { clickEvent, browseEvent } from "vue-track-plush"

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

#### TODO
    1. 现在通过 点击事件 [v-track:click] track-params="参数" 的情况还不支持 动态参数上传 可用自定义点击埋点指令 「 clickEvent 」 代替 
    2. 现在通过 浏览事件 [v-track:browse] track-params="参数" 的情况还不支持 动态参数上传 可用自定义点击埋点指令 「 browseEvent 」 代替 
