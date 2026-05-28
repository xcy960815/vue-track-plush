import 'intersection-observer';

import { createRequest } from './fetch';
import type { CustomEntry, DirectiveEntry, TrackPlushConfig, TrackParams } from './type';
import { getRuntimeInfo, resolveTrackParams } from './utils';

const CACHE_KEY = 'cacheTrackData';
const DEFAULT_MAX_NUM = 20;

if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  (IntersectionObserver.prototype as IntersectionObserver & { THROTTLE_TIMEOUT?: number }).THROTTLE_TIMEOUT =
    300;
}

export default class Exposure {
  private trackPlushConfig: Partial<TrackPlushConfig>;

  private cacheDataArr: TrackParams[];

  private maxNum: number;

  private timer = 0;

  private observer: IntersectionObserver | null = null;

  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}) {
    this.trackPlushConfig = trackPlushConfig;
    this.cacheDataArr = [];
    this.maxNum = Number(trackPlushConfig.maxNum) || DEFAULT_MAX_NUM;
    this.init();
  }

  init() {
    this.trackFromLocalStorage();

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          window.clearInterval(this.timer);
          const trackParams = resolveTrackParams(entry.target as HTMLElement);
          this.cacheDataArr.push(trackParams || null);
          this.observer?.unobserve(entry.target);

          if (this.cacheDataArr.length >= this.maxNum) {
            this.track();
          } else {
            this.storeIntoLocalStorage(this.cacheDataArr);
            if (this.cacheDataArr.length > 0) {
              this.timer = window.setInterval(() => {
                this.track();
              }, 2000);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      },
    );
  }

  handleExposureEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.handleSendTrack([currentEntry]);
      return;
    }

    if (!this.observer) return;

    if (entry.el.__vtpExposureCleanup) {
      entry.el.__vtpExposureCleanup();
    }

    this.observer.observe(entry.el);
    entry.el.__vtpExposureCleanup = () => {
      this.observer?.unobserve(entry.el);
    };
  }

  track() {
    const data = this.cacheDataArr.splice(0, this.maxNum);
    if (!data.length) return;

    this.handleSendTrack(data);
    this.storeIntoLocalStorage(this.cacheDataArr);
  }

  handleSendTrack(data: TrackParams[]) {
    createRequest({
      timeout: this.trackPlushConfig.timeout || 10000,
      baseURL: this.trackPlushConfig.baseURL,
      withCredentials: this.trackPlushConfig.withCredentials ?? true,
      url: this.trackPlushConfig.url,
      method: this.trackPlushConfig.method || 'post',
      headers: this.trackPlushConfig.headers,
      retry: this.trackPlushConfig.retry,
      retryDelay: this.trackPlushConfig.retryDelay,
      data: {
        actionType: '曝光事件',
        projectName: this.trackPlushConfig.projectName,
        ...getRuntimeInfo(this.trackPlushConfig.pageUrl, this.trackPlushConfig.userAgent),
        list: data,
      },
    });
  }

  destroy() {
    window.clearInterval(this.timer);
    this.observer?.disconnect();
    this.observer = null;
  }

  storeIntoLocalStorage(data: TrackParams[]) {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(data || []));
    } catch (error) {
      // localStorage can be unavailable in private mode or restricted webviews.
    }
  }

  trackFromLocalStorage() {
    try {
      const cacheData = window.localStorage.getItem(CACHE_KEY);
      if (!cacheData) return;

      const list = JSON.parse(cacheData) as TrackParams[];
      if (Array.isArray(list) && list.length > 0) {
        this.cacheDataArr.push(...list);
        this.track();
        window.localStorage.removeItem(CACHE_KEY);
      }
    } catch (error) {
      // Ignore malformed persisted tracking data.
    }
  }
}
