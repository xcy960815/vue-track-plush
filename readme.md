### vue-track-plush 一个基于 vue2 指令埋点的组件

### 安装方法

```sh
npm install vue-track-plush -S

OR

yarn add vue-track-plush
```

### 使用方法 (指令埋点)

```js

import Vue from "vue"

import * as VueTrackPlush from "vue-track-plush"

// 初始化vue指令
Vue.use(VueTrackPlush, { projectName: "项目名称", baseURL: <埋点地址的baseURL>, url: <埋点地址> })

// v-track:browse 页面浏览事件

// v-track:click 点击事件

// track-params="xxx" 绑定静态参数

// :track-params="xxx" 绑定动态参数

new Vue({
    el: '#app',
    template: `<div v-track:browse track-params="页面名称">
        <button v-track:click track-params="按钮名称">test</button>
    </div>`,
    })
```

### 使用方法 (点击埋点)

```js

import { clickEvent } from "vue-track-plush"

clickEvent({
    projectName: <项目名称>,
    baseURL: <埋点地址 baseURL>,
    url: <埋点地址 url>,
    pageName: <页面名称>
})
```

### 使用方法 (浏览埋点)

```js

import { browseEvent } from "vue-track-plush"

browseEvent({
    projectName: <项目名称>,
    baseURL: <埋点地址 baseURL>,
    url: <埋点地址 url>,
    pageName: <页面名称>
})
```
