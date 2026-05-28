import type { TrackPlushConfig } from '../plugin';

export const createDemoTrackConfig = (
  config: Partial<TrackPlushConfig> = {},
): TrackPlushConfig => ({
  baseURL: window.location.origin,
  url: '/track-api',
  projectName: '测试开发',
  debug: true,
  ...config,
});
