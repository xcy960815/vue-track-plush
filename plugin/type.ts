import type { VNode, VNodeDirective, VueConstructor } from 'vue';

export type TrackMethod = 'GET' | 'POST' | 'get' | 'post';

export type TrackParams = string | Record<string, unknown> | undefined;

export type TrackEventType = 'click' | 'browse' | 'exposure';

export type TrackActionType = '点击事件' | '浏览事件' | '曝光事件';

export type TrackPayloadData = Record<string, unknown>;

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

export interface TrackPlushConfig {
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

export interface NormalizedTrackPlushConfig extends Partial<TrackPlushConfig> {
  exposureThreshold: number;
  exposureDuration: number;
  exposureOnce: boolean;
  exposureRoot: Element | Document | null;
  exposureRootMargin: string;
  exposureQueueMaxSize: number;
  exposureQueueFlushInterval: number;
  exposureQueueStorageKey: string;
  debug: boolean;
}

export interface RequestConfig {
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

export interface TrackTransport {
  send(requestConfig: RequestConfig): Promise<void> | void;
}

export interface TrackPayload extends Record<string, unknown> {
  actionType: TrackActionType;
  projectName?: string;
  userAgent: string;
  pageUrl: string;
  timestamp: number;
}

export type ExposurePayload = TrackParams | null;

export interface DirectiveEntry {
  el: TrackElement;
  vnode?: VNode;
  binding?: VNodeDirective;
  type?: 'instruction';
}

export interface CustomEntry extends Record<string, unknown> {
  type: 'customize';
}

export interface TrackElement extends HTMLElement {
  __vtpTrackParams?: TrackParams;
  __vtpPrevTrackParamsString?: string;
  __vtpClickHandler?: EventListener;
  __vtpExposureCleanup?: () => void;
}

export interface VueTrackPlushPlugin {
  install(Vue: VueConstructor, options?: Partial<TrackPlushConfig>): void;
}
