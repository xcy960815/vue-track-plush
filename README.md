# vue-track-plush

[![npm](https://img.shields.io/npm/v/vue-track-plush.svg)](https://www.npmjs.com/package/vue-track-plush)
[![License](https://img.shields.io/npm/l/vue-track-plush.svg)](https://github.com/xcy960815/vue-track-plush)
[![npm](https://img.shields.io/npm/dm/vue-track-plush.svg)](https://github.com/xcy960815/vue-track-plush)
[![CI](https://img.shields.io/badge/CI-passing-brightgreen.svg)](https://github.com/xcy960815/vue-track-plush/actions)
[![GitHub issues](https://img.shields.io/github/issues/xcy960815/vue-track-plush.svg)](https://github.com/xcy960815/vue-track-plush/issues)
[![GitHub stars](https://img.shields.io/github/stars/xcy960815/vue-track-plush.svg?style=social&label=Stars)](https://github.com/xcy960815/vue-track-plush)
[![GitHub forks](https://img.shields.io/github/forks/xcy960815/vue-track-plush.svg?style=social&label=Fork)](https://github.com/xcy960815/vue-track-plush)

- Documentation: [https://xcy960815.github.io/vue-track-plush/](https://xcy960815.github.io/vue-track-plush/)
- Online Demo: [https://xcy960815.github.io/vue-track-plush/guide/demo](https://xcy960815.github.io/vue-track-plush/guide/demo)
- 中文说明：[README.zh-CN.md](./README.zh-CN.md)

`vue-track-plush` is a Vue 2 plugin that reports click, browse, and exposure events through the `v-track` directive.

The peer dependency is `vue@^2.7.0`. Vue 3 projects should use [`vue3-track-plush`](https://www.npmjs.com/package/vue3-track-plush).

## Features

- `v-track:click`, `v-track:browse`, and `v-track:exposure`
- One element can listen to several events, such as `v-track:click|exposure`
- A string value becomes `buttonName`, `pageName`, or `exposureName`
- Exposure uses `IntersectionObserver`, with a queue and `localStorage` backup
- `debug: true` prints the payload and does not send a request
- Manual `clickEvent`, `browseEvent`, and `exposureEvent` helpers

## Installation

```bash
npm install vue-track-plush -S
```

```bash
pnpm add vue-track-plush
```

## Quick Start

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
<button v-track:click="'buy'">Buy</button>
<div v-track:browse="{ pageName: 'home' }">Home</div>
<div v-track:exposure="{ exposureName: 'banner' }">Banner</div>
```

`projectName`, `baseURL`, and `url` are required for a real request. `baseURL` and `url` are joined into the request address.

## CDN / UMD Example

Load Vue 2 first. The UMD global is `VueTrackPlush`. If `window.Vue` already exists, the plugin installs itself.

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

### Plugin config

| Option                       | Type                      | Default            | Description                                      |
| ---------------------------- | ------------------------- | ------------------ | ------------------------------------------------ |
| `projectName`                | `string`                  | —                  | Sent with every event                            |
| `baseURL`                    | `string`                  | —                  | Request origin or base path                      |
| `url`                        | `string`                  | —                  | Path appended to `baseURL`                       |
| `method`                     | `'GET' \| 'POST'`         | `'POST'`           | Built-in XHR method                              |
| `pageName`                   | `string`                  | —                  | Default page name for manual browse events       |
| `buttonName`                 | `string`                  | —                  | Default button name for manual click events      |
| `exposureName`               | `string`                  | —                  | Default name for manual exposure events          |
| `pageUrl`                    | `string`                  | current page       | Overrides the page URL on every event            |
| `userAgent`                  | `string`                  | browser value      | Overrides the user agent on every event          |
| `debug`                      | `boolean`                 | `false`            | Print the payload and skip the network           |
| `exposureThreshold`          | `number`                  | `0.5`              | Visible ratio from 0 to 1                        |
| `exposureDuration`           | `number`                  | `0`                | Milliseconds the target must stay visible        |
| `exposureOnce`               | `boolean`                 | `true`             | Report each target once                          |
| `exposureRoot`               | `Element \| Document \| null` | `null`         | `IntersectionObserver` root                      |
| `exposureRootMargin`         | `string`                  | `'0px'`            | `IntersectionObserver` root margin               |
| `exposureQueueMaxSize`       | `number`                  | `20`               | Flush the exposure queue at this size            |
| `exposureQueueFlushInterval` | `number`                  | `2000`             | Flush interval, in milliseconds                  |
| `exposureQueueStorageKey`    | `string`                  | `'cacheTrackData'` | `localStorage` key for the exposure queue        |
| `timeout`                    | `number`                  | —                  | XHR timeout, in milliseconds                     |
| `withCredentials`            | `boolean`                 | —                  | Send cookies with the XHR                        |
| `headers`                    | `Record<string, string>`  | —                  | Extra XHR headers                                |
| `retry`                      | `number`                  | —                  | XHR retry count                                  |
| `retryDelay`                 | `number`                  | —                  | Delay between retries, in milliseconds           |
| `transport`                  | `TrackTransport`          | XHR                | Replaces the built-in request                    |

`queue.maxBatchSize`, `queue.flushInterval`, and `queue.storageKey` are the old names for the queue options. `exposure.threshold`, `duration`, `root`, `rootMargin`, and `once` are the old names for the exposure options. `maxNum` is the old name for `exposureQueueMaxSize`.

### Directive

| Argument   | When it reports                                      |
| ---------- | ---------------------------------------------------- |
| `click`    | On click                                             |
| `browse`   | When the element is bound, and again if the value changes |
| `exposure` | After the element stays visible long enough          |

A string value maps to `buttonName`, `pageName`, or `exposureName`. An object is merged into the payload. The older `track-params` attribute still works when the directive value is empty.

`v-track:click|exposure="'card'"` binds both events. Exposure control fields on the value, such as `threshold`, `duration`, `once`, `root`, and `rootMargin`, configure that element and are removed from the payload.

### Manual events

```ts
import { clickEvent, browseEvent, exposureEvent } from 'vue-track-plush'

clickEvent({
  projectName: 'demo',
  baseURL: 'https://example.com',
  url: '/track',
  buttonName: 'buy',
})
```

Each call creates its own tracker. Pass `projectName`, `baseURL`, and `url` again. `clickEvent` and `browseEvent` send immediately. `exposureEvent` sends immediately and does not enter the directive queue.

## Notes

- `debug: true` logs `[vue-track-plush][debug]` and does not open a request.
- Directive exposure is queued. The queue flushes at 20 items, every 2 seconds, and when the page is hidden or unloaded.
- A failed request is swallowed. Tracking does not throw into the page.
- Request settings (`baseURL`, `url`, `method`, `headers`, `timeout`, `retry`, `transport`, and the exposure settings) are not copied into the event payload.

## Build Artifacts

The published package currently includes:

- `dist/vue-track-plush.esm.js`: ESM build
- `dist/vue-track-plush.umd.js`: UMD build
- `types/vue-track-plush.d.ts`: TypeScript declarations

## Development

```bash
pnpm install
pnpm run dev
pnpm run lint
pnpm run build
```

## Project Structure

- `plugin/index.ts`: plugin entry, directive, and manual events
- `plugin/click.ts`: click directive
- `plugin/browse.ts`: browse directive
- `plugin/exposure.ts`: exposure observer
- `plugin/core/tracker.ts`: payload, queue, and transport
- `src/`: local demo

## License

MIT
