# vue-track-plush

Vue 2.7 tracking plugin based on custom directives. It supports click, page view, and exposure tracking, plus manual reporting APIs for custom scenarios.

> This package targets Vue 2.7. If you need Vue 3 support, use the Vue 3 package in your project instead.

## Features

- Vue 2 directive API: `v-track:click`, `v-track:browse`, `v-track:exposure`
- Manual APIs: `clickEvent`, `browseEvent`, `exposureEvent`
- String and object `track-params` support
- Batched exposure reporting with queue, interval flush, and localStorage cache
- Configurable request timeout, credentials, headers, retry, and retry delay
- TypeScript source and generated declaration file
- Vite library build with UMD and ESM outputs

## Installation

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

## Quick Start

```ts
import Vue from 'vue';
import VueTrackPlush from 'vue-track-plush';
import App from './App.vue';

Vue.use(VueTrackPlush, {
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  queue: {
    maxBatchSize: 20,
    flushInterval: 2000,
  },
  exposure: {
    threshold: 0.5,
    once: true,
  },
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

## Directive Usage

### Click Tracking

```vue
<template>
  <button
    v-track:click
    :track-params="{
      buttonName: 'Save',
      module: 'profile',
    }"
  >
    Save
  </button>
</template>
```

When `track-params` is a string, it is reported as `buttonName`.

```vue
<button v-track:click track-params="Save">Save</button>
```

### Browse Tracking

```vue
<template>
  <section
    v-track:browse
    :track-params="{
      pageName: 'Profile Page',
      module: 'profile',
    }"
  >
    Profile
  </section>
</template>
```

When `track-params` is a string, it is reported as `pageName`.

```vue
<section v-track:browse track-params="Profile Page">Profile</section>
```

### Exposure Tracking

```vue
<template>
  <div
    v-track:exposure
    :track-params="{
      areaName: 'Promotion Banner',
      bannerId: 1001,
    }"
  >
    Promotion Banner
  </div>
</template>
```

Exposure tracking uses `IntersectionObserver`. By default, an element is reported once when at least 50% of it enters the viewport.

### Combined Directives

Multiple event types can be bound to the same element with `|`.

```vue
<button
  v-track:click|exposure
  :track-params="{ buttonName: 'Buy Now', areaName: 'Buy Button' }"
>
  Buy Now
</button>
```

## Manual APIs

```ts
import { browseEvent, clickEvent, exposureEvent } from 'vue-track-plush';

clickEvent({
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  buttonName: 'Save',
  module: 'profile',
});

browseEvent({
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  pageName: 'Profile Page',
});

exposureEvent({
  baseURL: 'https://example.com',
  url: '/api/track',
  projectName: 'my-project',
  areaName: 'Promotion Banner',
});
```

## Configuration

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
  maxNum?: number;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  retry?: number;
  retryDelay?: number;
  queue?: QueueConfig;
  exposure?: ExposureConfig;
  [key: string]: unknown;
}

export interface QueueConfig {
  maxBatchSize?: number;
  flushInterval?: number;
  storageKey?: string;
}

export interface ExposureConfig {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `projectName` | `string` | Required | Project name included in every event. |
| `baseURL` | `string` | Required | Tracking API origin. |
| `url` | `string` | Required | Tracking API path. |
| `method` | `'GET' | 'POST'` | `'POST'` | Request method. |
| `pageUrl` | `string` | `window.location.href` | Page URL included in every event. |
| `userAgent` | `string` | `navigator.userAgent` | User agent included in every event. |
| `timeout` | `number` | `10000` | Request timeout in milliseconds. |
| `withCredentials` | `boolean` | `true` | Whether XHR sends credentials. |
| `headers` | `Record<string, string>` | `{}` | Custom request headers. |
| `retry` | `number` | `0` | Retry count after request failure. |
| `retryDelay` | `number` | `300` | Retry delay in milliseconds. |
| `queue.maxBatchSize` | `number` | `20` | Exposure batch size. |
| `queue.flushInterval` | `number` | `2000` | Exposure queue flush interval in milliseconds. |
| `queue.storageKey` | `string` | `'cacheTrackData'` | localStorage key for unsent exposure events. |
| `exposure.threshold` | `number` | `0.5` | Intersection threshold for exposure tracking. |
| `exposure.rootMargin` | `string` | `'0px'` | IntersectionObserver root margin. |
| `exposure.once` | `boolean` | `true` | Whether each exposure element is reported only once. |

## Payload Shape

Click and browse events are sent as a single object.

```json
{
  "actionType": "点击事件",
  "projectName": "my-project",
  "userAgent": "...",
  "pageUrl": "https://example.com/profile",
  "timestamp": 1710000000000,
  "buttonName": "Save",
  "module": "profile"
}
```

Exposure events are sent in batches.

```json
{
  "actionType": "曝光事件",
  "projectName": "my-project",
  "userAgent": "...",
  "pageUrl": "https://example.com/home",
  "timestamp": 1710000000000,
  "list": [
    {
      "areaName": "Promotion Banner",
      "bannerId": 1001
    }
  ]
}
```

## Demo

The local demo uses Vue Router and includes separate cases for different tracking scenarios.

| Route | Case |
| --- | --- |
| `#/click` | Directive click tracking and manual click tracking |
| `#/browse` | Directive browse tracking and manual browse tracking |
| `#/exposure` | First-screen exposure, scroll exposure, and manual exposure tracking |

Start the demo:

```sh
pnpm install
pnpm dev
```

Build the demo:

```sh
pnpm build:demo
```

The demo build output is written to `demo-dist`.

## Development

```sh
pnpm install
pnpm dev
```

Build the plugin:

```sh
pnpm build
```

Build outputs:

- `dist/vue-track-plush.umd.js`
- `dist/vue-track-plush.esm.js`
- `types/vue-track-plush.d.ts`

Watch plugin build:

```sh
pnpm dev:plugin
```

## Architecture

The package keeps the Vue 2 adapter thin and moves tracking behavior into an internal core layer.

```txt
plugin/
  index.ts              # Vue 2 install function, directive registration, public APIs
  click.ts              # DOM click binding
  browse.ts             # Browse directive handling
  exposure.ts           # IntersectionObserver binding
  core/
    tracker.ts          # Unified click/browse/exposure reporting
    queue.ts            # Exposure queue, interval flush, failure recovery
    storage.ts          # Safe localStorage wrapper
    transport.ts        # XHR transport and retry logic
    payload.ts          # Payload normalization
```

## License

MIT
