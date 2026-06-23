---
layout: home

hero:
  name: vue-track-plush
  text: 面向 Vue 2.7 的埋点插件
  tagline: 提供点击、浏览、曝光指令埋点，以及手动上报 API 和曝光队列控制能力。
  actions:
    - theme: brand
      text: 快速开始
      link: /zh-CN/guide/install
    - theme: alt
      text: 在线体验
      link: /zh-CN/guide/demo

features:
  - title: 指令优先
    details: 直接在 Vue 2 模板中使用 `v-track:click`、`v-track:browse`、`v-track:exposure`。
  - title: 手动上报
    details: 用 `clickEvent`、`browseEvent`、`exposureEvent` 覆盖非标准 DOM 行为场景。
  - title: 曝光队列可控
    details: 支持阈值、停留时长、单次上报、批量 flush 和本地缓存恢复。
---
