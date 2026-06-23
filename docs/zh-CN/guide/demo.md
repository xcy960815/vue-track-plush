# 在线 Demo

这个页面嵌入的是当前仓库本地开发时使用的同一套 Vue 2 demo 应用，因此线上文档和独立 demo 不会出现两套逻辑漂移的问题。

## 内置场景

| 路由 | 验证内容 |
| --- | --- |
| `basic` | 点击和浏览埋点的指令 value 传参 |
| `compatibility` | 旧版 `track-params` 字符串和对象兼容 |
| `exposure` | `threshold`、`duration`、`once` 以及曝光队列行为 |
| `manual` | `clickEvent`、`browseEvent`、`exposureEvent` 手动 API |

<DemoFrame
  title="交互式 Demo"
  description="这里嵌入的是和本地开发同一套 Vue 2 demo，便于直接验证埋点行为。"
  link-text="打开独立 Demo"
/>
