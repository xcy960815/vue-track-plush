import { VueConstructor } from 'vue';

type TrackMethod = 'GET' | 'POST' | 'get' | 'post';
type TrackParams = string | Record<string, unknown> | undefined;
type TrackActionType = '点击事件' | '浏览事件' | '曝光事件';
type TrackPayloadData = Record<string, unknown> | Array<Record<string, unknown>>;
interface QueueConfig {
    /** exposureQueueMaxSize 的旧别名。 */
    maxBatchSize?: number;
    /** exposureQueueFlushInterval 的旧别名。 */
    flushInterval?: number;
    /** exposureQueueStorageKey 的旧别名。 */
    storageKey?: string;
}
interface ExposureConfig {
    /** exposureThreshold 的旧别名。 */
    threshold?: number;
    /** exposureDuration 的旧别名。 */
    duration?: number;
    /** exposureRoot 的旧别名。 */
    root?: Element | Document | null;
    /** exposureRootMargin 的旧别名。 */
    rootMargin?: string;
    /** exposureOnce 的旧别名。 */
    once?: boolean;
}
interface TrackPlushConfig {
    /** 项目标识，会附带到每一条埋点数据中。 */
    projectName: string;
    /** 埋点请求的域名或基础路径。 */
    baseURL: string;
    /** 埋点请求接口路径，会拼接到 baseURL 后。 */
    url: string;
    /** 手动浏览上报时默认使用的 pageName。 */
    pageName?: string;
    /** 覆盖默认页面地址，附带到每一条埋点数据中。 */
    pageUrl?: string;
    /** 覆盖默认 User-Agent，附带到每一条埋点数据中。 */
    userAgent?: string;
    /** 内置 transport 使用的请求方法。 */
    method?: TrackMethod;
    /** 手动点击上报时默认使用的 buttonName。 */
    buttonName?: string;
    /** 手动曝光上报时默认使用的 exposureName。 */
    exposureName?: string;
    /** exposureQueueMaxSize 的旧别名。 */
    maxNum?: number;
    /** XHR 请求超时时间，单位毫秒。 */
    timeout?: number;
    /** XHR 请求是否携带凭证。 */
    withCredentials?: boolean;
    /** 内置 XHR transport 附带的自定义请求头。 */
    headers?: Record<string, string>;
    /** 内置 XHR transport 的失败重试次数。 */
    retry?: number;
    /** 内置 XHR transport 的重试间隔，单位毫秒。 */
    retryDelay?: number;
    /** 曝光埋点默认的可见比例阈值。 */
    exposureThreshold?: number;
    /** 曝光埋点默认要求持续可见的毫秒数。 */
    exposureDuration?: number;
    /** 曝光目标默认是否只上报一次。 */
    exposureOnce?: boolean;
    /** 曝光埋点默认使用的 IntersectionObserver root。 */
    exposureRoot?: Element | Document | null;
    /** 曝光埋点默认使用的 IntersectionObserver rootMargin。 */
    exposureRootMargin?: string;
    /** 曝光队列达到该数量后立即上报。 */
    exposureQueueMaxSize?: number;
    /** 曝光队列自动上报间隔，单位毫秒。 */
    exposureQueueFlushInterval?: number;
    /** 持久化曝光队列数据时使用的存储 key。 */
    exposureQueueStorageKey?: string;
    /** 为 true 时只打印 payload，不发起真实网络请求。 */
    debug?: boolean;
    /** 自定义 transport，用于替换内置请求实现。 */
    transport?: TrackTransport;
    /** 兼容旧配置的 queue 别名。 */
    queue?: QueueConfig;
    /** 兼容旧配置的 exposure 别名。 */
    exposure?: ExposureConfig;
    [key: string]: unknown;
}
interface RequestConfig {
    /** 请求使用的域名或基础路径。 */
    baseURL?: string;
    /** 会拼接到 baseURL 后的接口路径。 */
    url?: string;
    /** transport 使用的请求方法。 */
    method?: TrackMethod;
    /** 单条事件数据或曝光批量数据。 */
    data?: TrackPayloadData;
    /** 为 true 时跳过请求，仅输出 payload。 */
    debug?: boolean;
    /** XHR 请求是否携带凭证。 */
    withCredentials?: boolean;
    /** XHR 请求超时时间，单位毫秒。 */
    timeout?: number;
    /** 内置 XHR transport 附带的自定义请求头。 */
    headers?: Record<string, string>;
    /** XHR 请求成功后的回调。 */
    onSuccess?: (xhr: XMLHttpRequest) => void;
    /** XHR 请求失败后的回调。 */
    onError?: (xhr: XMLHttpRequest) => void;
    /** 内置 XHR transport 的失败重试次数。 */
    retry?: number;
    /** 内置 XHR transport 的重试间隔，单位毫秒。 */
    retryDelay?: number;
}
interface TrackTransport {
    /** 插件使用的自定义请求发送器。 */
    send(requestConfig: RequestConfig): Promise<void> | void;
}
interface VueTrackPlushPlugin {
    install(Vue: VueConstructor, options?: Partial<TrackPlushConfig>): void;
}

/**
 * @param {TrackPlushConfig} trackPlushConfig Click tracking config and custom payload fields.
 */
declare const clickEvent: (trackPlushConfig: TrackPlushConfig) => void;
/**
 * @param {TrackPlushConfig} trackPlushConfig Browse tracking config and custom payload fields.
 */
declare const browseEvent: (trackPlushConfig: TrackPlushConfig) => void;
/**
 * @param {TrackPlushConfig} trackPlushConfig Exposure tracking config and custom payload fields.
 */
declare const exposureEvent: (trackPlushConfig: TrackPlushConfig) => void;

declare const _default: VueTrackPlushPlugin;

export { browseEvent, clickEvent, _default as default, exposureEvent };
export type { ExposureConfig, QueueConfig, RequestConfig, TrackActionType, TrackMethod, TrackParams, TrackPlushConfig, TrackTransport };
