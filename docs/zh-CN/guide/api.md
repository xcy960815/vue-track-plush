# API

## 导出项

| 导出项 | 类型 | 说明 |
| --- | --- | --- |
| `default` | Vue 插件 | 注册 `v-track` 指令，并安装全局埋点能力。 |
| `clickEvent` | function | 手动发送点击埋点。 |
| `browseEvent` | function | 手动发送浏览或页面访问埋点。 |
| `exposureEvent` | function | 手动发送曝光埋点。 |

## 指令模式

| 指令 | 主要字段 | 典型场景 |
| --- | --- | --- |
| `v-track:click` | `buttonName` | 按钮、标签页、操作链接 |
| `v-track:browse` | `pageName` | 路由容器、页面区块 |
| `v-track:exposure` | `exposureName` | Banner、卡片、列表项进入视口 |

同一个元素可以用 `|` 绑定多个事件类型。

```vue
<button
  v-track:click|exposure="{
    buttonName: '立即购买',
    exposureName: '购买按钮',
  }"
>
  立即购买
</button>
```

## 手动 API

```ts
import { browseEvent, clickEvent, exposureEvent } from 'vue-track-plush';

clickEvent({
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  buttonName: '保存',
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

## `TrackPlushConfig`

插件接收一个较灵活的配置对象，下面列出最常用的一组字段。

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `projectName` | `string` | 必填 | 每个事件都会携带的项目标识。 |
| `baseURL` | `string` | 必填 | 请求基础地址。 |
| `url` | `string` | 必填 | 埋点接口路径。 |
| `method` | `'GET' \| 'POST' \| 'get' \| 'post'` | `POST` | 上报请求使用的 HTTP 方法。 |
| `pageName` | `string` | 当前路由或页面 | 默认浏览事件名称。 |
| `buttonName` | `string` | - | 默认点击事件名称。 |
| `exposureName` | `string` | - | 默认曝光事件名称。 |
| `timeout` | `number` | transport 默认值 | 请求超时时间，单位毫秒。 |
| `withCredentials` | `boolean` | `false` | 是否携带 cookie 和凭证。 |
| `headers` | `Record<string, string>` | `{}` | 自定义请求头。 |
| `retry` | `number` | `0` | 失败后的重试次数。 |
| `retryDelay` | `number` | `0` | 重试间隔，单位毫秒。 |
| `debug` | `boolean` | `false` | 本地调试时打印请求 payload。 |
| `transport` | `TrackTransport` | 内置 fetch transport | 自定义上报实现。 |

## 曝光配置

这组配置既可以全局传入，也可以在单个 `v-track:exposure` 元素上覆盖。

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `exposureThreshold` | `number` | `0.5` | 进入多少可见比例后开始计数。 |
| `exposureDuration` | `number` | `0` | 满足最小停留时间后才上报。 |
| `exposureOnce` | `boolean` | `true` | 每个元素是否只上报一次。 |
| `exposureRoot` | `Element \| Document \| null` | `null` | `IntersectionObserver` 使用的滚动容器。 |
| `exposureRootMargin` | `string` | `'0px'` | 曝光观察的 root margin。 |
| `exposureQueueMaxSize` | `number` | 实现默认值 | 每批曝光事件的最大数量。 |
| `exposureQueueFlushInterval` | `number` | 实现默认值 | 定时 flush 间隔，单位毫秒。 |
| `exposureQueueStorageKey` | `string` | 实现默认值 | localStorage 中保存曝光队列的 key。 |

## 兼容旧写法

推荐新项目直接使用指令 value，但当 `binding.value` 为 `undefined` 时，插件仍会兼容 `track-params`。

```vue
<button v-track:click track-params="保存">保存</button>

<section v-track:browse :track-params="{ pageName: '个人资料页' }">
  个人资料
</section>
```
