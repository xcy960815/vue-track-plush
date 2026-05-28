import 'intersection-observer';

import type { CustomEntry, DirectiveEntry, NormalizedTrackPlushConfig, TrackPlushConfig } from './type';
import Tracker from './core/tracker';
import {
  normalizeConfig,
  normalizeTrackParams,
  removeExposureOptionParams,
  resolveExposureOptions,
  resolveNormalizedTrackParams,
} from './utils';

if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  (IntersectionObserver.prototype as IntersectionObserver & { THROTTLE_TIMEOUT?: number }).THROTTLE_TIMEOUT =
    300;
}

/**
 * Handles exposure tracking through IntersectionObserver and the shared tracker queue.
 */
export default class Exposure {
  private trackPlushConfig: NormalizedTrackPlushConfig;

  private tracker: Tracker;

  /**
   * @param {Partial<TrackPlushConfig>} trackPlushConfig Plugin-level tracking configuration.
   * @param {Tracker} [tracker] Shared tracker instance used by directive handlers.
   */
  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}, tracker?: Tracker) {
    this.trackPlushConfig = normalizeConfig(trackPlushConfig);
    this.tracker = tracker || new Tracker(trackPlushConfig);
  }

  /**
   * @param {DirectiveEntry | CustomEntry} entry Directive entry for observed DOM nodes or custom exposure payload.
   */
  handleExposureEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.tracker.exposureNow(normalizeTrackParams('exposure', currentEntry));
      return;
    }

    if (entry.el.__vtpExposureCleanup) {
      entry.el.__vtpExposureCleanup();
    }

    const params = resolveNormalizedTrackParams('exposure', entry.el, entry.binding, entry.vnode);
    const options = resolveExposureOptions(this.trackPlushConfig, params);
    const trackParams = removeExposureOptionParams(params);
    let tracked = false;
    let visibleTimer: ReturnType<typeof window.setTimeout> | null = null;
    let observer: IntersectionObserver | null = null;

    const clearVisibleTimer = () => {
      if (!visibleTimer) return;
      window.clearTimeout(visibleTimer);
      visibleTimer = null;
    };

    const reportExposure = () => {
      if (options.once && tracked) return;
      tracked = true;
      this.tracker.exposure(trackParams);
    };

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      reportExposure();
      entry.el.__vtpExposureCleanup = clearVisibleTimer;
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((observerEntry) => {
          if (!observerEntry.isIntersecting) {
            clearVisibleTimer();
            return;
          }

          if (options.duration > 0) {
            clearVisibleTimer();
            visibleTimer = window.setTimeout(() => {
              reportExposure();
              if (options.once) observer?.disconnect();
            }, options.duration);
            return;
          }

          reportExposure();
          if (options.once) observer?.disconnect();
        });
      },
      {
        root: options.root,
        rootMargin: options.rootMargin,
        threshold: options.threshold,
      },
    );

    observer.observe(entry.el);
    entry.el.__vtpExposureCleanup = () => {
      clearVisibleTimer();
      observer?.disconnect();
    };
  }

  /**
   * Disconnects the observer and releases tracker resources.
   */
  destroy() {
    this.tracker.destroy();
  }
}
