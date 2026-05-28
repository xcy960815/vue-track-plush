import 'intersection-observer';

import type { CustomEntry, DirectiveEntry, TrackPlushConfig, TrackParams } from './type';
import Tracker from './core/tracker';
import { resolveTrackParams } from './utils';

if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  (IntersectionObserver.prototype as IntersectionObserver & { THROTTLE_TIMEOUT?: number }).THROTTLE_TIMEOUT =
    300;
}

export default class Exposure {
  private trackPlushConfig: Partial<TrackPlushConfig>;

  private tracker: Tracker;

  private observer: IntersectionObserver | null = null;

  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}, tracker?: Tracker) {
    this.trackPlushConfig = trackPlushConfig;
    this.tracker = tracker || new Tracker(trackPlushConfig);
    this.init();
  }

  init() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const trackParams = resolveTrackParams(entry.target as HTMLElement);
          this.tracker.exposure(trackParams);

          if (this.trackPlushConfig.exposure?.once !== false) {
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: this.trackPlushConfig.exposure?.rootMargin || '0px',
        threshold: this.trackPlushConfig.exposure?.threshold ?? 0.5,
      },
    );
  }

  handleExposureEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.tracker.exposureNow(currentEntry);
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

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
    this.tracker.destroy();
  }
}
