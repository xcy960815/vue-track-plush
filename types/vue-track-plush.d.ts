import { VueConstructor } from 'vue';

type TrackMethod = 'GET' | 'POST' | 'get' | 'post';
type TrackParams = string | Record<string, unknown> | undefined;
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
export type { TrackMethod, TrackParams, TrackPlushConfig };
