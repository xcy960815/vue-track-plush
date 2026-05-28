import { VueConstructor } from 'vue';

type TrackMethod = 'GET' | 'POST' | 'get' | 'post';
type TrackParams = string | Record<string, unknown> | undefined;
type TrackActionType = '点击事件' | '浏览事件' | '曝光事件';
interface QueueConfig {
    maxBatchSize?: number;
    flushInterval?: number;
    storageKey?: string;
}
interface ExposureConfig {
    threshold?: number;
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
interface VueTrackPlushPlugin {
    install(Vue: VueConstructor, options?: Partial<TrackPlushConfig>): void;
}

declare const clickEvent: (trackPlushConfig: TrackPlushConfig) => void;
declare const browseEvent: (trackPlushConfig: TrackPlushConfig) => void;
declare const exposureEvent: (trackPlushConfig: TrackPlushConfig) => void;

declare const _default: VueTrackPlushPlugin;

export { browseEvent, clickEvent, _default as default, exposureEvent };
export type { ExposureConfig, QueueConfig, TrackActionType, TrackMethod, TrackParams, TrackPlushConfig };
