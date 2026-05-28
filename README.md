# vue-track-plush

Vue 2.7 tracking plugin based on custom directives. It supports click, page view, and exposure tracking, plus manual reporting APIs for custom scenarios.

> This package targets Vue 2.7. If you need Vue 3 support, use the Vue 3 package in your project instead.

## Features

- Vue 2 directive API with the recommended `v-track:click="{ ... }"`, `v-track:browse="{ ... }"`, and `v-track:exposure="{ ... }"` syntax
- Manual APIs: `clickEvent`, `browseEvent`, `exposureEvent`
- Legacy `track-params` string and object compatibility
- Batched exposure reporting with queue, interval flush, and localStorage cache
- Global and per-element exposure options
- Configurable request timeout, credentials, headers, retry, and retry delay
- Pluggable `transport`
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

Vue 2 installation is still `Vue.use(VueTrackPlush, config)`.

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

## Directive Usage

### Click Tracking

```vue
<template>
  <button v-track:click="{ buttonName: 'Save' }">Save</button>
</template>
```

When the directive value is a string, it is reported as `buttonName`.

```vue
<button v-track:click="'Save'">Save</button>
```

### Browse Tracking

```vue
<template>
  <section v-track:browse="{ pageName: 'Profile Page' }">Profile</section>
</template>
```

When the directive value is a string, it is reported as `pageName`.

```vue
<section v-track:browse="'Profile Page'">Profile</section>
```

### Exposure Tracking

```vue
<template>
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

Exposure tracking uses `IntersectionObserver`. By default, an element is reported once when at least 50% of it enters the viewport. Each element can override `threshold`, `duration`, `once`, `root`, and `rootMargin` from the directive value; those control fields are removed from the final reporting payload.

When the exposure directive value is a string, it is reported as `exposureName`.

```vue
<div v-track:exposure="'Promotion Banner'">Promotion Banner</div>
```

### Legacy `track-params`

The recommended syntax for new code is the directive value. The plugin still supports the previous `track-params` syntax for compatibility. It reads `vnode.data.attrs['track-params']` only when `binding.value` is `undefined`, then falls back to the DOM `track-params` attribute.

```vue
<button v-track:click track-params="Save">Save</button>

<section v-track:browse :track-params="{ pageName: 'Profile Page' }">Profile</section>

<div v-track:exposure :track-params="{ areaName: 'Promotion Banner' }">Promotion Banner</div>
```

Legacy exposure `areaName` remains a normal business payload field. New code should use `exposureName`.

### Combined Directives

Multiple event types can be bound to the same element with `|`.

```vue
<button v-track:click|exposure="{ buttonName: 'Buy Now', exposureName: 'Buy Button' }">
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
  exposureName: 'Promotion Banner',
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
| `debug` | `boolean` | `false` | Skip network requests and print the final tracking payload JSON to the console. |
| `transport` | `TrackTransport` | built-in XHR transport | Custom reporting transport. |
| `exposureThreshold` | `number` | `0.5` | Default visible ratio for exposure tracking. |
| `exposureDuration` | `number` | `0` | Default visible duration in milliseconds before reporting exposure. |
| `exposureOnce` | `boolean` | `true` | Whether each exposure element is reported only once. |
| `exposureRoot` | `Element | Document | null` | `null` | Default IntersectionObserver root. |
| `exposureRootMargin` | `string` | `'0px'` | Default IntersectionObserver root margin. |
| `exposureQueueMaxSize` | `number` | `20` | Exposure batch size. |
| `exposureQueueFlushInterval` | `number` | `2000` | Exposure queue flush interval in milliseconds. |
| `exposureQueueStorageKey` | `string` | `'cacheTrackData'` | localStorage key for unsent exposure events. |

Legacy config remains supported: `queue.maxBatchSize` maps to `exposureQueueMaxSize`, `queue.flushInterval` maps to `exposureQueueFlushInterval`, `queue.storageKey` maps to `exposureQueueStorageKey`, `exposure.threshold` maps to `exposureThreshold`, `exposure.duration` maps to `exposureDuration`, `exposure.root` maps to `exposureRoot`, `exposure.rootMargin` maps to `exposureRootMargin`, and `exposure.once` maps to `exposureOnce`.

### Custom Transport

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

## Payload Shape

When `debug` is enabled, the same payload is printed to the console with the `[vue-track-plush][debug]` prefix and no network request is sent.

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
      "exposureName": "Promotion Banner",
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
