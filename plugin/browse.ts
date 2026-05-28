import { createRequest } from './fetch';
import type { CustomEntry, DirectiveEntry, TrackPlushConfig } from './type';
import { getRuntimeInfo, normalizeTrackParams, resolveTrackParams } from './utils';

export default class Browse {
  private trackPlushConfig: Partial<TrackPlushConfig>;

  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}) {
    this.trackPlushConfig = trackPlushConfig;
  }

  handleBrowseEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.handleSendTrack({
        ...getRuntimeInfo(this.trackPlushConfig.pageUrl, this.trackPlushConfig.userAgent),
        projectName: this.trackPlushConfig.projectName,
        actionType: '浏览事件',
        ...currentEntry,
      });
      return;
    }

    const trackParams = resolveTrackParams(entry.el, entry.vnode);
    this.handleSendTrack({
      ...getRuntimeInfo(this.trackPlushConfig.pageUrl, this.trackPlushConfig.userAgent),
      projectName: this.trackPlushConfig.projectName,
      actionType: '浏览事件',
      ...normalizeTrackParams(trackParams, 'pageName'),
    });
  }

  handleSendTrack(trackParams: Record<string, unknown>) {
    createRequest({
      timeout: this.trackPlushConfig.timeout || 10000,
      baseURL: this.trackPlushConfig.baseURL,
      withCredentials: this.trackPlushConfig.withCredentials ?? true,
      url: this.trackPlushConfig.url,
      method: this.trackPlushConfig.method || 'post',
      headers: this.trackPlushConfig.headers,
      retry: this.trackPlushConfig.retry,
      retryDelay: this.trackPlushConfig.retryDelay,
      data: trackParams,
    });
  }
}
