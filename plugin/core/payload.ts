import type {
  ExposurePayload,
  NormalizedTrackPlushConfig,
  TrackActionType,
  TrackPayload,
} from '../type';

/**
 * @param {string} [pageUrl] Optional page URL override.
 * @param {string} [userAgent] Optional user agent override.
 * @returns {{ userAgent: string; pageUrl: string }} Runtime metadata attached to every event.
 */
export const getRuntimeInfo = (pageUrl?: string, userAgent?: string) => ({
  userAgent: userAgent || window.navigator.userAgent,
  pageUrl: pageUrl || window.location.href,
});

/**
 * @param {NormalizedTrackPlushConfig} config Plugin-level tracking configuration.
 * @param {TrackActionType} actionType Tracking action type.
 * @param {Record<string, unknown>} payload Event-specific payload fields.
 * @returns {TrackPayload} Final payload sent to transport.
 */
export const createTrackPayload = (
  config: NormalizedTrackPlushConfig,
  actionType: TrackActionType,
  payload: Record<string, unknown>,
): TrackPayload => ({
  ...getRuntimeInfo(config.pageUrl, config.userAgent),
  projectName: config.projectName,
  actionType,
  timestamp: Date.now(),
  ...payload,
});

/**
 * @param {NormalizedTrackPlushConfig} config Plugin-level tracking configuration.
 * @param {ExposurePayload[]} list Batched exposure payload list.
 * @returns {TrackPayload} Final exposure payload sent to transport.
 */
export const createExposurePayload = (
  config: NormalizedTrackPlushConfig,
  list: ExposurePayload[],
): TrackPayload => ({
  ...getRuntimeInfo(config.pageUrl, config.userAgent),
  projectName: config.projectName,
  actionType: '曝光事件',
  timestamp: Date.now(),
  list,
});
