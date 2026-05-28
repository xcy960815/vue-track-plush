import type { VNode, VNodeDirective, VueConstructor } from 'vue';

import Browse from './browse';
import Click from './click';
import Tracker from './core/tracker';
import Exposure from './exposure';
import type { TrackElement, TrackParams, TrackPlushConfig, VueTrackPlushPlugin } from './type';
import { stringifyTrackParams } from './utils';

const ignoreField = ['baseURL', 'url'];

const resolveVNodeTrackParams = (el: TrackElement, vnode?: VNode): TrackParams => {
  const attrs = vnode?.data?.attrs || {};
  return attrs['track-params'] !== undefined
    ? (attrs['track-params'] as TrackParams)
    : el.getAttribute('track-params') || undefined;
};

const cacheTrackParams = (el: TrackElement, vnode?: VNode) => {
  const trackParams = resolveVNodeTrackParams(el, vnode);
  el.__vtpTrackParams = trackParams;
  el.__vtpPrevTrackParamsString = stringifyTrackParams(trackParams);
  return trackParams;
};

const install = function install(Vue: VueConstructor, trackPlushConfig: Partial<TrackPlushConfig> = {}) {
  const tracker = new Tracker(trackPlushConfig);
  const click = new Click(trackPlushConfig, tracker);
  const browse = new Browse(trackPlushConfig, tracker);
  const exposure = new Exposure(trackPlushConfig, tracker);

  Vue.directive('track', {
    bind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
      const trackElement = el as TrackElement;
      cacheTrackParams(trackElement, vnode);

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
      const next = resolveVNodeTrackParams(trackElement, vnode);
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

export const clickEvent = (trackPlushConfig: TrackPlushConfig) => {
  const clickEventParams: Record<string, unknown> = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key)) clickEventParams[key] = trackPlushConfig[key];
  });

  const tracker = new Tracker(trackPlushConfig);
  tracker.click(clickEventParams).finally(() => tracker.destroy());
};

export const browseEvent = (trackPlushConfig: TrackPlushConfig) => {
  const browseEventParams: Record<string, unknown> = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key)) browseEventParams[key] = trackPlushConfig[key];
  });

  const tracker = new Tracker(trackPlushConfig);
  tracker.browse(browseEventParams).finally(() => tracker.destroy());
};

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
} from './type';

export default {
  install,
} as VueTrackPlushPlugin;
