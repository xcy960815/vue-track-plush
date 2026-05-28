import type { VNode, VNodeDirective, VueConstructor } from 'vue';

import Browse from './browse';
import Click from './click';
import Tracker from './core/tracker';
import Exposure from './exposure';
import type { TrackElement, TrackParams, TrackPlushConfig, VueTrackPlushPlugin } from './type';
import {
  normalizeTrackParams,
  resolveDirectiveTrackParams,
  stringifyTrackParams,
} from './utils';

const ignoreField = [
  'baseURL',
  'debug',
  'exposure',
  'exposureDuration',
  'exposureOnce',
  'exposureQueueFlushInterval',
  'exposureQueueMaxSize',
  'exposureQueueStorageKey',
  'exposureRoot',
  'exposureRootMargin',
  'exposureThreshold',
  'headers',
  'maxNum',
  'method',
  'queue',
  'retry',
  'retryDelay',
  'timeout',
  'transport',
  'url',
  'withCredentials',
];

/**
 * @param {TrackElement} el Directive-bound element.
 * @param {VNode} [vnode] Vue vnode containing dynamic attrs.
 * @returns {TrackParams} Resolved `track-params` value.
 */
const cacheTrackParams = (el: TrackElement, binding?: VNodeDirective, vnode?: VNode) => {
  const trackParams = resolveDirectiveTrackParams(el, binding, vnode);
  el.__vtpTrackParams = trackParams;
  el.__vtpPrevTrackParamsString = stringifyTrackParams(trackParams);
  return trackParams;
};

/**
 * @param {VueConstructor} Vue Vue 2 constructor used to register the directive.
 * @param {Partial<TrackPlushConfig>} [trackPlushConfig] Plugin-level tracking configuration.
 */
const install = function install(Vue: VueConstructor, trackPlushConfig: Partial<TrackPlushConfig> = {}) {
  const tracker = new Tracker(trackPlushConfig);
  const click = new Click(trackPlushConfig, tracker);
  const browse = new Browse(trackPlushConfig, tracker);
  const exposure = new Exposure(trackPlushConfig, tracker);

  Vue.directive('track', {
    bind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
      const trackElement = el as TrackElement;
      cacheTrackParams(trackElement, binding, vnode);

      (binding.arg || '').split('|').forEach((item) => {
        if (item === 'click') {
          click.handleClickEvent({
            el: trackElement,
            vnode,
            binding,
            type: 'instruction',
          });
        } else if (item === 'exposure') {
          exposure.handleExposureEvent({
            el: trackElement,
            vnode,
            binding,
            type: 'instruction',
          });
        } else if (item === 'browse') {
          browse.handleBrowseEvent({
            el: trackElement,
            vnode,
            binding,
            type: 'instruction',
          });
        }
      });
    },
    update(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
      const trackElement = el as TrackElement;
      const prevStr = trackElement.__vtpPrevTrackParamsString;
      const next = resolveDirectiveTrackParams(trackElement, binding, vnode);
      const nextStr = stringifyTrackParams(next);

      trackElement.__vtpTrackParams = next;
      trackElement.__vtpPrevTrackParamsString = nextStr;

      if ((binding.arg || '').split('|').includes('browse') && nextStr !== prevStr) {
        browse.handleBrowseEvent({
          el: trackElement,
          vnode,
          binding,
          type: 'instruction',
        });
      }

      if ((binding.arg || '').split('|').includes('exposure') && nextStr !== prevStr) {
        exposure.handleExposureEvent({
          el: trackElement,
          vnode,
          binding,
          type: 'instruction',
        });
      }
    },
    unbind(el: HTMLElement) {
      const trackElement = el as TrackElement;

      if (trackElement.__vtpClickHandler) {
        trackElement.removeEventListener('click', trackElement.__vtpClickHandler);
      }

      trackElement.__vtpExposureCleanup?.();
      delete trackElement.__vtpTrackParams;
      delete trackElement.__vtpPrevTrackParamsString;
      delete trackElement.__vtpClickHandler;
      delete trackElement.__vtpExposureCleanup;
    },
  });
};

if (typeof window !== 'undefined' && (window as Window & { Vue?: VueConstructor }).Vue) {
  install((window as Window & { Vue: VueConstructor }).Vue);
}

/**
 * @param {TrackPlushConfig} trackPlushConfig Click tracking config and custom payload fields.
 */
export const clickEvent = (trackPlushConfig: TrackPlushConfig) => {
  const clickEventParams: Record<string, unknown> = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key)) clickEventParams[key] = trackPlushConfig[key];
  });

  const tracker = new Tracker(trackPlushConfig);
  tracker.click(normalizeTrackParams('click', clickEventParams)).finally(() => tracker.destroy());
};

/**
 * @param {TrackPlushConfig} trackPlushConfig Browse tracking config and custom payload fields.
 */
export const browseEvent = (trackPlushConfig: TrackPlushConfig) => {
  const browseEventParams: Record<string, unknown> = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key)) browseEventParams[key] = trackPlushConfig[key];
  });

  const tracker = new Tracker(trackPlushConfig);
  tracker.browse(normalizeTrackParams('browse', browseEventParams)).finally(() => tracker.destroy());
};

/**
 * @param {TrackPlushConfig} trackPlushConfig Exposure tracking config and custom payload fields.
 */
export const exposureEvent = (trackPlushConfig: TrackPlushConfig) => {
  const exposureEventParams: Record<string, unknown> = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key)) exposureEventParams[key] = trackPlushConfig[key];
  });

  const tracker = new Tracker(trackPlushConfig);
  tracker.exposureNow(exposureEventParams).finally(() => tracker.destroy());
};

export type {
  ExposureConfig,
  QueueConfig,
  TrackActionType,
  TrackMethod,
  TrackParams,
  TrackPlushConfig,
  TrackTransport,
  RequestConfig,
} from './type';

export default {
  install,
} as VueTrackPlushPlugin;
