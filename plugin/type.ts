import type { VNode, VNodeDirective, VueConstructor } from 'vue';

export type TrackMethod = 'GET' | 'POST' | 'get' | 'post';

export type TrackParams = string | Record<string, unknown> | undefined;

export type TrackActionType = '点击事件' | '浏览事件' | '曝光事件';

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

export interface TrackPlushConfig {
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

export interface RequestConfig {
  baseURL?: string;
  url?: string;
  method?: TrackMethod;
  data?: Record<string, unknown>;
  withCredentials?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
  onSuccess?: (xhr: XMLHttpRequest) => void;
  onError?: (xhr: XMLHttpRequest) => void;
  retry?: number;
  retryDelay?: number;
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
