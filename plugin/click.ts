import { createRequest } from './fetch';
import type { CustomEntry, DirectiveEntry, TrackPlushConfig } from './type';
import { getRuntimeInfo, normalizeTrackParams, resolveTrackParams } from './utils';

export default class Click {
  private trackPlushConfig: Partial<TrackPlushConfig>;

  constructor(trackPlushConfig: Partial<TrackPlushConfig> = {}) {
    this.trackPlushConfig = trackPlushConfig;
  }

  handleClickEvent(entry: DirectiveEntry | CustomEntry) {
    if (entry.type === 'customize') {
      const { type: _type, ...currentEntry } = entry;
      this.handleSendTrack({
        ...getRuntimeInfo(this.trackPlushConfig.pageUrl, this.trackPlushConfig.userAgent),
        projectName: this.trackPlushConfig.projectName,
        actionType: '点击事件',
        ...currentEntry,
      });
      return;
    }

    if (entry.el.__vtpClickHandler) {
      entry.el.removeEventListener('click', entry.el.__vtpClickHandler);
    }

    entry.el.__vtpClickHandler = () => {
      const trackParams = resolveTrackParams(entry.el, entry.vnode);
      this.handleSendTrack({
        ...getRuntimeInfo(this.trackPlushConfig.pageUrl, this.trackPlushConfig.userAgent),
        projectName: this.trackPlushConfig.projectName,
        actionType: '点击事件',
        ...normalizeTrackParams(trackParams, 'buttonName'),
      });
    };

    entry.el.addEventListener('click', entry.el.__vtpClickHandler);
  }

  handleSendTrack(trackParams: Record<string, unknown>) {
    createRequest({
      baseURL: this.trackPlushConfig.baseURL,
      url: this.trackPlushConfig.url,
      method: this.trackPlushConfig.method || 'post',
      timeout: this.trackPlushConfig.timeout,
      withCredentials: this.trackPlushConfig.withCredentials,
      headers: this.trackPlushConfig.headers,
      retry: this.trackPlushConfig.retry,
      retryDelay: this.trackPlushConfig.retryDelay,
      data: trackParams,
    });
  }
}
