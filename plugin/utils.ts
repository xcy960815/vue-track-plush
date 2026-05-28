import type {
  NormalizedTrackPlushConfig,
  TrackElement,
  TrackEventType,
  TrackParams,
  TrackPlushConfig,
} from './type';

const DEFAULT_EXPOSURE_THRESHOLD = 0.5;
const DEFAULT_EXPOSURE_DURATION = 0;
const DEFAULT_EXPOSURE_ONCE = true;
const DEFAULT_EXPOSURE_ROOT = null;
const DEFAULT_EXPOSURE_ROOT_MARGIN = '0px';
const DEFAULT_EXPOSURE_QUEUE_MAX_SIZE = 20;
const DEFAULT_EXPOSURE_QUEUE_FLUSH_INTERVAL = 2000;
const DEFAULT_EXPOSURE_QUEUE_STORAGE_KEY = 'cacheTrackData';

const EXPOSURE_OPTION_KEYS = new Set([
  'duration',
  'exposureDuration',
  'exposureOnce',
  'exposureRoot',
  'exposureRootMargin',
  'exposureThreshold',
  'once',
  'root',
  'rootMargin',
  'threshold',
]);

const getNumberOption = (value: unknown): number | undefined => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return value;
};

const getPositiveNumberOption = (value: unknown): number | undefined => {
  const numberValue = getNumberOption(value);
  if (numberValue === undefined || numberValue <= 0) return undefined;
  return numberValue;
};

const clampThreshold = (threshold: number) => Math.min(Math.max(threshold, 0), 1);

const getStringParamKey = (eventType: TrackEventType) => {
  if (eventType === 'browse') return 'pageName';
  if (eventType === 'exposure') return 'exposureName';
  return 'buttonName';
};

/**
 * @param {TrackParams} trackParams Raw directive tracking parameters.
 * @returns {string} Stable string representation used to detect parameter changes.
 */
export const stringifyTrackParams = (trackParams: TrackParams) => {
  if (typeof trackParams === 'string') return trackParams;

  try {
    return JSON.stringify(trackParams || '');
  } catch (error) {
    return '';
  }
};

/**
 * @param {TrackElement} el Element bound by the tracking directive.
 * @param {Vue.VNodeDirective} [binding] Vue directive binding that may contain the recommended value syntax.
 * @param {Vue.VNode} [vnode] Vue vnode that may contain dynamic `track-params` attrs.
 * @returns {TrackParams} Resolved directive parameters using public API priority.
 */
export const resolveDirectiveTrackParams = (
  el: TrackElement,
  binding?: Vue.VNodeDirective,
  vnode?: Vue.VNode,
): TrackParams => {
  if (binding && binding.value !== undefined) return binding.value as TrackParams;

  const attrs = vnode?.data?.attrs || {};
  return attrs['track-params'] !== undefined
    ? (attrs['track-params'] as TrackParams)
    : el.getAttribute('track-params') || undefined;
};

/**
 * @param {TrackElement} el Element bound by the tracking directive.
 * @param {Vue.VNodeDirective} [binding] Vue directive binding that may contain the recommended value syntax.
 * @param {Vue.VNode} [vnode] Vue vnode that may contain dynamic `track-params` attrs.
 * @returns {TrackParams} Latest resolved tracking parameters from cache or public API sources.
 */
export const resolveTrackParams = (
  el: TrackElement,
  binding?: Vue.VNodeDirective,
  vnode?: Vue.VNode,
): TrackParams => {
  if (binding || vnode) return resolveDirectiveTrackParams(el, binding, vnode);
  if (el.__vtpTrackParams !== undefined) return el.__vtpTrackParams;
  return resolveDirectiveTrackParams(el);
};

/**
 * @param {TrackEventType} eventType Directive event type.
 * @param {TrackParams} trackParams Raw string or object tracking parameters.
 * @returns {Record<string, unknown>} Object payload with string values mapped by event type.
 */
export const normalizeTrackParams = (
  eventType: TrackEventType,
  trackParams: TrackParams,
): Record<string, unknown> => {
  if (typeof trackParams === 'string') {
    return {
      [getStringParamKey(eventType)]: trackParams,
    };
  }

  return trackParams && typeof trackParams === 'object' ? trackParams : {};
};

/**
 * @param {TrackEventType} eventType Directive event type.
 * @param {TrackElement} el Element bound by the tracking directive.
 * @param {Vue.VNodeDirective} [binding] Vue directive binding.
 * @param {Vue.VNode} [vnode] Vue vnode containing dynamic attrs.
 * @returns {Record<string, unknown>} Normalized directive payload.
 */
export const resolveNormalizedTrackParams = (
  eventType: TrackEventType,
  el: TrackElement,
  binding?: Vue.VNodeDirective,
  vnode?: Vue.VNode,
) => normalizeTrackParams(eventType, resolveTrackParams(el, binding, vnode));

/**
 * @param {Record<string, unknown>} params Normalized exposure directive params.
 * @returns {Record<string, unknown>} Exposure payload without IntersectionObserver control fields.
 */
export const removeExposureOptionParams = (
  params: Record<string, unknown>,
): Record<string, unknown> =>
  Object.entries(params).reduce<Record<string, unknown>>((result, [key, value]) => {
    if (!EXPOSURE_OPTION_KEYS.has(key)) result[key] = value;
    return result;
  }, {});

/**
 * @param {Partial<TrackPlushConfig>} config Public config using either Vue 2 legacy or Vue 3-compatible names.
 * @returns {NormalizedTrackPlushConfig} Internal config with all supported aliases resolved.
 */
export const normalizeConfig = (
  config: Partial<TrackPlushConfig> = {},
): NormalizedTrackPlushConfig => ({
  ...config,
  exposureThreshold:
    getNumberOption(config.exposureThreshold) ??
    getNumberOption(config.exposure?.threshold) ??
    DEFAULT_EXPOSURE_THRESHOLD,
  exposureDuration:
    getNumberOption(config.exposureDuration) ??
    getNumberOption(config.exposure?.duration) ??
    DEFAULT_EXPOSURE_DURATION,
  exposureOnce: config.exposureOnce ?? config.exposure?.once ?? DEFAULT_EXPOSURE_ONCE,
  exposureRoot: config.exposureRoot ?? config.exposure?.root ?? DEFAULT_EXPOSURE_ROOT,
  exposureRootMargin:
    config.exposureRootMargin ?? config.exposure?.rootMargin ?? DEFAULT_EXPOSURE_ROOT_MARGIN,
  exposureQueueMaxSize:
    getPositiveNumberOption(config.exposureQueueMaxSize) ??
    getPositiveNumberOption(config.queue?.maxBatchSize) ??
    getPositiveNumberOption(Number(config.maxNum)) ??
    DEFAULT_EXPOSURE_QUEUE_MAX_SIZE,
  exposureQueueFlushInterval:
    getPositiveNumberOption(config.exposureQueueFlushInterval) ??
    getPositiveNumberOption(config.queue?.flushInterval) ??
    DEFAULT_EXPOSURE_QUEUE_FLUSH_INTERVAL,
  exposureQueueStorageKey:
    config.exposureQueueStorageKey ??
    config.queue?.storageKey ??
    DEFAULT_EXPOSURE_QUEUE_STORAGE_KEY,
  debug: config.debug ?? false,
});

/**
 * @param {NormalizedTrackPlushConfig} config Normalized plugin config.
 * @param {Record<string, unknown>} params Normalized exposure directive params.
 * @returns Required exposure observer options for one element.
 */
export const resolveExposureOptions = (
  config: NormalizedTrackPlushConfig,
  params: Record<string, unknown>,
) => {
  const threshold =
    getNumberOption(params.exposureThreshold) ??
    getNumberOption(params.threshold) ??
    config.exposureThreshold;

  const duration =
    getNumberOption(params.exposureDuration) ??
    getNumberOption(params.duration) ??
    config.exposureDuration;

  return {
    once:
      typeof params.once === 'boolean'
        ? params.once
        : typeof params.exposureOnce === 'boolean'
          ? params.exposureOnce
          : config.exposureOnce,
    threshold: clampThreshold(threshold),
    duration: Math.max(duration, 0),
    root:
      (params.root as Element | Document | null | undefined) ??
      (params.exposureRoot as Element | Document | null | undefined) ??
      config.exposureRoot,
    rootMargin:
      typeof params.rootMargin === 'string'
        ? params.rootMargin
        : typeof params.exposureRootMargin === 'string'
          ? params.exposureRootMargin
          : config.exposureRootMargin,
  };
};
