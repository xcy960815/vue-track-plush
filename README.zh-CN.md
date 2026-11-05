# vue-track-plush

[English README](./README.md)

- 文档地址：[https://xcy960815.github.io/vue-track-plush/zh-CN/](https://xcy960815.github.io/vue-track-plush/zh-CN/)
- 在线 Demo：[https://xcy960815.github.io/vue-track-plush/zh-CN/guide/demo](https://xcy960815.github.io/vue-track-plush/zh-CN/guide/demo)

`vue-track-plush` 是 Vue 2 的埋点插件，用 `v-track` 上报点击、浏览和曝光。

对等依赖是 `vue@^2.7.0`。Vue 3 项目用 [`vue3-track-plush`](https://www.npmjs.com/package/vue3-track-plush)。

## 功能特性

- `v-track:click`、`v-track:browse`、`v-track:exposure`
- 同一个元素可以同时监听多种事件，例如 `v-track:click|exposure`
- 字符串会变成 `buttonName`、`pageName` 或 `exposureName`
- 曝光使用 `IntersectionObserver`，队列会备份到 `localStorage`
- `debug: true` 只打印数据，不发请求
- 提供 `clickEvent`、`browseEvent`、`exposureEvent` 手动上报

## 安装

```bash
npm install vue-track-plush -S
```

```bash
pnpm add vue-track-plush
```

## 快速开始

```ts
import Vue from 'vue'
import VueTrackPlush from 'vue-track-plush'

Vue.use(VueTrackPlush, {
  projectName: 'demo',
  baseURL: 'https://example.com',
  url: '/track',
})
```

```vue
<button v-track:click="'buy'">购买</button>
<div v-track:browse="{ pageName: 'home' }">首页</div>
<div v-track:exposure="{ exposureName: 'banner' }">横幅</div>
```

真正发请求时需要 `projectName`、`baseURL` 和 `url`。`baseURL` 和 `url` 会拼成请求地址。

## CDN / UMD 用法

先加载 Vue 2。UMD 全局名是 `VueTrackPlush`。如果页面上已经有 `window.Vue`，插件会自己安装。

```html
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-track-plush/dist/vue-track-plush.umd.js"></script>
<script>
  Vue.use(VueTrackPlush, {
    projectName: 'demo',
    baseURL: 'https://example.com',
    url: '/track',
  })
</script>
```

## API

### 插件配置

| 参数                         | 类型                      | 默认值             | 说明                         |
| ---------------------------- | ------------------------- | ------------------ | ---------------------------- |
| `projectName`                | `string`                  | —                  | 每条事件都会带上             |
| `baseURL`                    | `string`                  | —                  | 请求域名或基础路径           |
| `url`                        | `string`                  | —                  | 拼在 `baseURL` 后面的路径    |
| `method`                     | `'GET' \| 'POST'`         | `'POST'`           | 内置 XHR 的方法              |
| `pageName`                   | `string`                  | —                  | 手动浏览事件的默认页面名     |
| `buttonName`                 | `string`                  | —                  | 手动点击事件的默认按钮名     |
| `exposureName`               | `string`                  | —                  | 手动曝光事件的默认名称       |
| `pageUrl`                    | `string`                  | 当前页面           | 覆盖每条事件里的页面地址     |
| `userAgent`                  | `string`                  | 浏览器值           | 覆盖每条事件里的 User-Agent  |
| `debug`                      | `boolean`                 | `false`            | 打印数据，不发请求           |
| `exposureThreshold`          | `number`                  | `0.5`              | 可见比例，范围 0 到 1        |
| `exposureDuration`           | `number`                  | `0`                | 需要持续可见的毫秒数         |
| `exposureOnce`               | `boolean`                 | `true`             | 每个目标只上报一次           |
| `exposureRoot`               | `Element \| Document \| null` | `null`         | `IntersectionObserver` 的 root |
| `exposureRootMargin`         | `string`                  | `'0px'`            | root 边距                    |
| `exposureQueueMaxSize`       | `number`                  | `20`               | 曝光队列达到这个数量就上报   |
| `exposureQueueFlushInterval` | `number`                  | `2000`             | 自动上报间隔，单位毫秒       |
| `exposureQueueStorageKey`    | `string`                  | `'cacheTrackData'` | 曝光队列的 `localStorage` 键 |
| `timeout`                    | `number`                  | —                  | XHR 超时，单位毫秒           |
| `withCredentials`            | `boolean`                 | —                  | XHR 是否携带凭证             |
| `headers`                    | `Record<string, string>`  | —                  | 额外请求头                   |
| `retry`                      | `number`                  | —                  | 失败重试次数                 |
| `retryDelay`                 | `number`                  | —                  | 重试间隔，单位毫秒           |
| `transport`                  | `TrackTransport`          | XHR                | 替换内置请求                 |

`queue.maxBatchSize`、`queue.flushInterval`、`queue.storageKey` 是队列配置的旧名字。`exposure.threshold`、`duration`、`root`、`rootMargin`、`once` 是曝光配置的旧名字。`maxNum` 是 `exposureQueueMaxSize` 的旧名字。

### 指令

| 参数       | 上报时机                         |
| ---------- | -------------------------------- |
| `click`    | 点击时                           |
| `browse`   | 元素绑定时；参数变化时再报一次   |
| `exposure` | 元素持续可见达到要求后           |

字符串会映射成 `buttonName`、`pageName` 或 `exposureName`。对象会合并进上报数据。指令值为空时，仍然可以使用旧的 `track-params`。

`v-track:click|exposure="'card'"` 会同时绑定两种事件。写在指令值上的 `threshold`、`duration`、`once`、`root`、`rootMargin` 只控制这个元素，不会进入上报数据。

### 手动上报

```ts
import { clickEvent, browseEvent, exposureEvent } from 'vue-track-plush'

clickEvent({
  projectName: 'demo',
  baseURL: 'https://example.com',
  url: '/track',
  buttonName: 'buy',
})
```

每次调用都会新建一个 tracker，所以要再次传入 `projectName`、`baseURL` 和 `url`。`clickEvent` 和 `browseEvent` 会立刻发送。`exposureEvent` 也会立刻发送，不进入指令那条队列。

## 使用说明

- `debug: true` 会打印 `[vue-track-plush][debug]`，并且不会发请求。
- 指令曝光会进队列。队列在满 20 条、每 2 秒，以及页面隐藏或卸载时上报。
- 请求失败会被吃掉，不会抛到页面里。
- `baseURL`、`url`、`method`、`headers`、`timeout`、`retry`、`transport` 和曝光配置不会复制进事件数据。

## 构建产物说明

当前发布包包含：

- `dist/vue-track-plush.esm.js`：ESM
- `dist/vue-track-plush.umd.js`：UMD
- `types/vue-track-plush.d.ts`：TypeScript 类型声明

## 本地开发

```bash
pnpm install
pnpm run dev
pnpm run lint
pnpm run build
```

## 项目结构

- `plugin/index.ts`：插件入口、指令和手动上报
- `plugin/click.ts`：点击指令
- `plugin/browse.ts`：浏览指令
- `plugin/exposure.ts`：曝光观察
- `plugin/core/tracker.ts`：数据、队列和请求
- `src/`：本地 demo

## License

MIT
