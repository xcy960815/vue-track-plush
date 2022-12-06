import { createRequest } from "./fetch";

// 页面浏览
export default class Browse {
  trackConfig;

  static instance;

  static getInstance(trackConfig) {
    if (!this.instance) {
      this.instance = new Browse(trackConfig);
    }
    return this.instance;
  }

  constructor(trackConfig) {
    this.trackConfig = trackConfig;
  }
  // 处理浏览事件
  handleBrowseEvent(trackParams) {
    this.handleSendTrack(
      typeof trackParams === "object" ? trackParams : { pageName: trackParams }
    );
  }
  /**
   * 事件上报
   * @param {Object} trackParams
   */
  handleSendTrack(trackParams) {
    const requestParams = Object.assign(
      {
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
        actionType: "浏览事件",
        projectName: this.trackConfig.projectName,
      },
      trackParams
    );

    createRequest({
      baseURL: this.trackConfig.baseURL,
      url: this.trackConfig.url,
      data: requestParams,
    });
  }
}
