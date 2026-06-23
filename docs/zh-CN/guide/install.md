# 安装

`vue-track-plush` 面向 Vue `^2.7.0` 项目发布，提供 ESM、UMD 和 TypeScript 声明文件。

## 安装命令

```sh
pnpm add vue-track-plush
```

```sh
npm install vue-track-plush
```

```sh
yarn add vue-track-plush
```

## 兼容性

| 依赖 | 版本 |
| --- | --- |
| Vue | `^2.7.0` |
| 本地开发 Node.js | `^20.19.0 || >=22.12.0` |

## 快速开始

```ts
import Vue from 'vue';
import VueTrackPlush from 'vue-track-plush';
import App from './App.vue';

Vue.use(VueTrackPlush, {
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  debug: process.env.NODE_ENV === 'development',
  exposureThreshold: 0.5,
  exposureDuration: 300,
  exposureOnce: true,
  exposureQueueMaxSize: 20,
  exposureQueueFlushInterval: 2000,
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

## 基础指令

```vue
<template>
  <button v-track:click="{ buttonName: '保存' }">保存</button>

  <section v-track:browse="{ pageName: '个人资料页' }">
    个人资料
  </section>

  <div
    v-track:exposure="{
      exposureName: '活动 Banner',
      threshold: 0.5,
      duration: 1000,
    }"
  >
    活动 Banner
  </div>
</template>
```

## 本地文档调试

文档站启动前会先把现有 Vue 2 demo 重新构建到 `docs/public/demo`，这样文档页里嵌入的演示始终和源码保持同一份逻辑。

```sh
pnpm run docs:dev
```
