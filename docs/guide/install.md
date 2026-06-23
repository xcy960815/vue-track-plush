# Install

`vue-track-plush` targets Vue `^2.7.0` projects and is shipped as an npm package with ESM, UMD, and type definitions.

## Package manager

```sh
pnpm add vue-track-plush
```

```sh
npm install vue-track-plush
```

```sh
yarn add vue-track-plush
```

## Compatibility

| Package | Version |
| --- | --- |
| Vue | `^2.7.0` |
| Node.js for local development | `^20.19.0 || >=22.12.0` |

## Quick start

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

## Basic directive usage

```vue
<template>
  <button v-track:click="{ buttonName: 'Save' }">Save</button>

  <section v-track:browse="{ pageName: 'Profile Page' }">
    Profile
  </section>

  <div
    v-track:exposure="{
      exposureName: 'Promotion Banner',
      threshold: 0.5,
      duration: 1000,
    }"
  >
    Promotion Banner
  </div>
</template>
```

## Local docs workflow

The docs site rebuilds the existing Vue 2 demo into `docs/public/demo` before VitePress starts, so the embedded demo always reflects the current source code.

```sh
pnpm run docs:dev
```
