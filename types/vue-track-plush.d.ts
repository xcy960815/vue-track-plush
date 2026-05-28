import { VueConstructor } from 'vue';

type TrackMethod = 'GET' | 'POST' | 'get' | 'post';
type TrackParams = string | Record<string, unknown> | undefined;
type TrackActionType = '点击事件' | '浏览事件' | '曝光事件';
type TrackPayloadData = Record<string, unknown>;
interface QueueConfig {
    maxBatchSize?: number;
    flushInterval?: number;
    storageKey?: string;
}
interface ExposureConfig {
    threshold?: number;
    duration?: number;
    root?: Element | Document | null;
    rootMargin?: string;
    once?: boolean;
}
interface TrackPlushConfig {
    projectName: string;
    baseURL: string;
    url: string;
    pageName?: string;
    pageUrl?: string;
    userAgent?: string;
    method?: TrackMethod;
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
interface RequestConfig {
    baseURL?: string;
    url?: string;
    method?: TrackMethod;
    data?: TrackPayloadData;
    debug?: boolean;
    withCredentials?: boolean;
    timeout?: number;
    headers?: Record<string, string>;
    onSuccess?: (xhr: XMLHttpRequest) => void;
    onError?: (xhr: XMLHttpRequest) => void;
    retry?: number;
    retryDelay?: number;
}
interface TrackTransport {
    send(requestConfig: RequestConfig): Promise<void> | void;
}
interface VueTrackPlushPlugin {
    install(Vue: VueConstructor, options?: Partial<TrackPlushConfig>): void;
}

declare const clickEvent: (trackPlushConfig: TrackPlushConfig) => void;
declare const browseEvent: (trackPlushConfig: TrackPlushConfig) => void;
declare const exposureEvent: (trackPlushConfig: TrackPlushConfig) => void;

declare const _default: VueTrackPlushPlugin;

export { browseEvent, clickEvent, _default as default, exposureEvent };
export type { ExposureConfig, QueueConfig, RequestConfig, TrackActionType, TrackMethod, TrackParams, TrackPlushConfig, TrackTransport };
