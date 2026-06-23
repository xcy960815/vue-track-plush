# API

## Exports

| Export | Type | Description |
| --- | --- | --- |
| `default` | Vue plugin | Registers the `v-track` directive and installs global tracking behavior. |
| `clickEvent` | function | Sends a manual click tracking event. |
| `browseEvent` | function | Sends a manual browse or page-view tracking event. |
| `exposureEvent` | function | Sends a manual exposure tracking event. |

## Directive modes

| Directive | Main field | Typical usage |
| --- | --- | --- |
| `v-track:click` | `buttonName` | Buttons, tabs, or action links |
| `v-track:browse` | `pageName` | Route containers or page sections |
| `v-track:exposure` | `exposureName` | Banners, cards, or list items entering the viewport |

Multiple event types can be bound to one element with `|`.

```vue
<button
  v-track:click|exposure="{
    buttonName: 'Buy Now',
    exposureName: 'Buy Button',
  }"
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

## `TrackPlushConfig`

The plugin accepts a flexible configuration object. The most commonly used options are listed below.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `projectName` | `string` | Required | Project identifier attached to every event. |
| `baseURL` | `string` | Required | Request base URL. |
| `url` | `string` | Required | Tracking endpoint path. |
| `method` | `'GET' \| 'POST' \| 'get' \| 'post'` | `POST` | HTTP method used by the transport layer. |
| `pageName` | `string` | Current route or page | Default browse event name. |
| `buttonName` | `string` | - | Default click event name. |
| `exposureName` | `string` | - | Default exposure event name. |
| `timeout` | `number` | transport default | Request timeout in milliseconds. |
| `withCredentials` | `boolean` | `false` | Sends cookies and credentials with the request. |
| `headers` | `Record<string, string>` | `{}` | Custom request headers. |
| `retry` | `number` | `0` | Retry attempts when sending fails. |
| `retryDelay` | `number` | `0` | Delay between retry attempts in milliseconds. |
| `debug` | `boolean` | `false` | Prints request payloads for local inspection. |
| `transport` | `TrackTransport` | built-in fetch transport | Custom request implementation. |

## Exposure configuration

These fields can be supplied globally or overridden per element in `v-track:exposure`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `exposureThreshold` | `number` | `0.5` | Intersection ratio required before tracking starts. |
| `exposureDuration` | `number` | `0` | Minimum visible time before reporting. |
| `exposureOnce` | `boolean` | `true` | Whether each element reports only once. |
| `exposureRoot` | `Element \| Document \| null` | `null` | Scroll container used by `IntersectionObserver`. |
| `exposureRootMargin` | `string` | `'0px'` | Root margin for exposure observation. |
| `exposureQueueMaxSize` | `number` | implementation default | Max exposure events per batch. |
| `exposureQueueFlushInterval` | `number` | implementation default | Timed flush interval in milliseconds. |
| `exposureQueueStorageKey` | `string` | implementation default | localStorage key for queue persistence. |

## Compatibility mode

The recommended syntax is the directive value itself, but legacy `track-params` is still supported when `binding.value` is `undefined`.

```vue
<button v-track:click track-params="Save">Save</button>

<section v-track:browse :track-params="{ pageName: 'Profile Page' }">
  Profile
</section>
```
