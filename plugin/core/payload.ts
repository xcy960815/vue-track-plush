import type { ExposurePayload, TrackActionType, TrackParams, TrackPayload, TrackPlushConfig } from '../type';

export const getRuntimeInfo = (pageUrl?: string, userAgent?: string) => ({
  userAgent: userAgent || window.navigator.userAgent,
  pageUrl: pageUrl || window.location.href,
});

export const normalizeTrackParams = (trackParams: TrackParams, stringKey: string) => {
  if (typeof trackParams === 'string') {
    return {
      [stringKey]: trackParams,
    };
  }

  return trackParams && typeof trackParams === 'object' ? trackParams : {};
};

export const createTrackPayload = (
  config: Partial<TrackPlushConfig>,
  actionType: TrackActionType,
  payload: Record<string, unknown>,
): TrackPayload => ({
  ...getRuntimeInfo(config.pageUrl, config.userAgent),
  projectName: config.projectName,
  actionType,
  timestamp: Date.now(),
  ...payload,
});

export const createExposurePayload = (
  config: Partial<TrackPlushConfig>,
  list: ExposurePayload[],
): TrackPayload => ({
  ...getRuntimeInfo(config.pageUrl, config.userAgent),
  projectName: config.projectName,
  actionType: '曝光事件',
  timestamp: Date.now(),
  list,
});
