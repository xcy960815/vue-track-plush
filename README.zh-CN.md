# vue-track-plush

基于 Vue 2.7 自定义指令的埋点统计插件。支持点击、浏览、曝光埋点，也提供手动上报 API，适合在 Vue 2 项目中快速接入基础行为埋点。

> 当前包定位为 Vue 2.7 插件。如果需要 Vue 3 支持，请在项目中使用对应的 Vue 3 版本。

## 特性

- Vue 2 指令 API：推荐使用 `v-track:click="{ ... }"`、`v-track:browse="{ ... }"`、`v-track:exposure="{ ... }"`
- 手动上报 API：`clickEvent`、`browseEvent`、`exposureEvent`
- 兼容旧版 `track-params` 字符串和对象写法
- 曝光事件支持批量队列、定时 flush 和 localStorage 缓存
- 曝光参数支持全局配置和单个元素覆盖
- 支持自定义上报 `transport`
- 请求支持超时、携带凭证、自定义 headers、失败重试和重试间隔
- TypeScript 源码和声明文件
- Vite library mode 构建，输出 UMD 和 ESM

## 安装

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

Vue2 安装方式仍然是 `Vue.use(VueTrackPlush, config)`。

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
  exposureDuration: 0,
  exposureOnce: true,
  exposureQueueMaxSize: 20,
  exposureQueueFlushInterval: 2000,
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

## 指令用法

### 点击埋点

```vue
<template>
  <button v-track:click="{ buttonName: '保存' }">保存</button>
</template>
```

当指令 value 是字符串时，会作为 `buttonName` 上报。

```vue
<button v-track:click="'保存'">保存</button>
```

### 浏览埋点

```vue
<template>
  <section v-track:browse="{ pageName: '个人资料页' }">个人资料</section>
</template>
```

当指令 value 是字符串时，会作为 `pageName` 上报。

```vue
<section v-track:browse="'个人资料页'">个人资料</section>
```

### 曝光埋点

```vue
<template>
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

曝光埋点基于 `IntersectionObserver`。默认元素进入视口 50% 后触发，并且每个元素只上报一次。单个元素可通过指令 value 覆盖 `threshold`、`duration`、`once`、`root`、`rootMargin`；这些控制字段不会进入最终上报 payload。

当曝光指令 value 是字符串时，会作为 `exposureName` 上报。

```vue
<div v-track:exposure="'活动 Banner'">活动 Banner</div>
```

### 兼容旧写法 `track-params`

推荐新项目使用指令 value 写法。插件仍兼容旧版本的 `track-params`，仅当 `binding.value` 是 `undefined` 时才会读取 `vnode.data.attrs['track-params']`，最后读取 DOM 上的 `track-params` 属性。

```vue
<button v-track:click track-params="保存">保存</button>

<section v-track:browse :track-params="{ pageName: '个人资料页' }">个人资料</section>

<div v-track:exposure :track-params="{ areaName: '活动 Banner' }">活动 Banner</div>
```

曝光旧写法里的 `areaName` 会继续作为普通业务字段上报；新代码建议使用 `exposureName`。

### 组合指令

同一个元素可以通过 `|` 绑定多个事件类型。

```vue
<button v-track:click|exposure="{ buttonName: '立即购买', exposureName: '购买按钮' }">
  立即购买
</button>
```

## 手动上报 API

```ts
import { browseEvent, clickEvent, exposureEvent } from 'vue-track-plush';

clickEvent({
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  buttonName: '保存',
  module: 'profile',
});

browseEvent({
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  pageName: '个人资料页',
});

exposureEvent({
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  exposureName: '活动 Banner',
});
```

## 配置项

```ts
export interface TrackPlushConfig {
  projectName: string;
  baseURL: string;
  url: string;
  pageName?: string;
  pageUrl?: string;
  userAgent?: string;
  method?: 'GET' | 'POST' | 'get' | 'post';
  buttonName?: string;
  exposureName?: string;
  maxNum?: number;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  retry?: number;
  retryDelay?: number;
  exposureThreshold?: number;
  exposureDuration?: number;
  exposureOnce?: boolean;
  exposureRoot?: Element | Document | null;
  exposureRootMargin?: string;
  exposureQueueMaxSize?: number;
  exposureQueueFlushInterval?: number;
  exposureQueueStorageKey?: string;
  debug?: boolean;
  transport?: TrackTransport;
  queue?: QueueConfig;
  exposure?: ExposureConfig;
  [key: string]: unknown;
}

export interface TrackTransport {
  send(requestConfig: RequestConfig): Promise<void> | void;
}

export interface RequestConfig {
  baseURL?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'get' | 'post';
  data?: Record<string, unknown>;
  debug?: boolean;
  withCredentials?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: number;
  retryDelay?: number;
}

export interface QueueConfig {
  maxBatchSize?: number;
  flushInterval?: number;
  storageKey?: string;
}

export interface ExposureConfig {
  threshold?: number;
  duration?: number;
  root?: Element | Document | null;
  rootMargin?: string;
  once?: boolean;
}
```

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `projectName` | `string` | 必填 | 项目名称，会随每个事件上报。 |
| `baseURL` | `string` | 必填 | 埋点接口域名。 |
| `url` | `string` | 必填 | 埋点接口路径。 |
| `method` | `'GET' | 'POST'` | `'POST'` | 请求方法。 |
| `pageUrl` | `string` | `window.location.href` | 上报事件携带的页面 URL。 |
| `userAgent` | `string` | `navigator.userAgent` | 上报事件携带的 User-Agent。 |
| `timeout` | `number` | `10000` | 请求超时时间，单位毫秒。 |
| `withCredentials` | `boolean` | `true` | XHR 是否携带凭证。 |
| `headers` | `Record<string, string>` | `{}` | 自定义请求头。 |
| `retry` | `number` | `0` | 请求失败后的重试次数。 |
| `retryDelay` | `number` | `300` | 重试间隔，单位毫秒。 |
| `debug` | `boolean` | `false` | 跳过接口请求，并在控制台输出最终上报 payload JSON。 |
| `transport` | `TrackTransport` | 内置 XHR transport | 自定义上报实现。 |
| `exposureThreshold` | `number` | `0.5` | 默认曝光可见比例。 |
| `exposureDuration` | `number` | `0` | 默认曝光停留时长，单位毫秒。 |
| `exposureOnce` | `boolean` | `true` | 每个曝光元素是否只上报一次。 |
| `exposureRoot` | `Element | Document | null` | `null` | 默认 IntersectionObserver root。 |
| `exposureRootMargin` | `string` | `'0px'` | 默认 IntersectionObserver rootMargin。 |
| `exposureQueueMaxSize` | `number` | `20` | 曝光批量上报数量。 |
| `exposureQueueFlushInterval` | `number` | `2000` | 曝光队列定时上报间隔，单位毫秒。 |
| `exposureQueueStorageKey` | `string` | `'cacheTrackData'` | 未上报曝光事件的 localStorage 缓存 key。 |

旧配置仍兼容：`queue.maxBatchSize` 会映射到 `exposureQueueMaxSize`，`queue.flushInterval` 会映射到 `exposureQueueFlushInterval`，`queue.storageKey` 会映射到 `exposureQueueStorageKey`，`exposure.threshold` 会映射到 `exposureThreshold`，`exposure.duration` 会映射到 `exposureDuration`，`exposure.root` 会映射到 `exposureRoot`，`exposure.rootMargin` 会映射到 `exposureRootMargin`，`exposure.once` 会映射到 `exposureOnce`。

### 自定义 transport

```ts
import VueTrackPlush, { type TrackTransport } from 'vue-track-plush';

const transport: TrackTransport = {
  send(requestConfig) {
    return fetch(`${requestConfig.baseURL}${requestConfig.url}`, {
      method: requestConfig.method || 'POST',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: JSON.stringify(requestConfig.data),
      credentials: 'include',
    }).then(() => undefined);
  },
};

Vue.use(VueTrackPlush, {
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  transport,
});
```

## 上报数据结构

开启 `debug` 后，不会发送网络请求；插件会以 `[vue-track-plush][debug]` 前缀在控制台输出同样的 payload JSON。

点击和浏览事件会以单个对象上报。

```json
{
  "actionType": "点击事件",
  "projectName": "my-project",
  "userAgent": "...",
  "pageUrl": "https://example.com/profile",
  "timestamp": 1710000000000,
  "buttonName": "保存",
  "module": "profile"
}
```

曝光事件会批量上报。

```json
{
  "actionType": "曝光事件",
  "projectName": "my-project",
  "userAgent": "...",
  "pageUrl": "https://example.com/home",
  "timestamp": 1710000000000,
  "list": [
    {
      "exposureName": "活动 Banner",
      "bannerId": 1001
    }
  ]
}
```

## Demo

本地 demo 使用 Vue Router，把不同埋点场景拆成独立页面。

| 路由 | 场景 |
| --- | --- |
| `#/click` | 指令点击埋点、手动点击埋点 |
| `#/browse` | 指令浏览埋点、手动浏览埋点 |
| `#/exposure` | 首屏曝光、滚动曝光、手动曝光埋点 |

启动 demo：

```sh
pnpm install
pnpm dev
```

## 本地开发

```sh
pnpm install
pnpm dev
```

构建插件：

```sh
pnpm build
```

构建产物：

- `dist/vue-track-plush.umd.js`
- `dist/vue-track-plush.esm.js`
- `types/vue-track-plush.d.ts`

监听插件构建：

```sh
pnpm dev:plugin
```

## 架构说明

项目保留轻量的 Vue 2 适配层，把核心埋点能力拆到内部 core 层。

```txt
plugin/
  index.ts              # Vue 2 install、指令注册、公开 API
  click.ts              # DOM 点击绑定
  browse.ts             # 浏览指令处理
  exposure.ts           # IntersectionObserver 绑定
  core/
    tracker.ts          # 统一 click/browse/exposure 上报入口
    queue.ts            # 曝光队列、定时 flush、失败恢复
    storage.ts          # 安全 localStorage 封装
    transport.ts        # XHR 请求和重试逻辑
    payload.ts          # payload 标准化
```

## License

MIT
