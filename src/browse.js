import { createRequest } from "./fetch";

// 页面浏览
export default class Browse {
  trackPlushConfig = {
    baseURL: "",
    url: "",
    projectName: "",
  };
  trackParams = null;
  constructor(trackPlushConfig) {
    this.trackPlushConfig.baseURL = trackPlushConfig.baseURL;
    this.trackPlushConfig.url = trackPlushConfig.url;
    this.trackPlushConfig.projectName = trackPlushConfig.projectName;
  }
  // 处理浏览事件
  handleDirectiveBrowseEvent(trackParams) {
    const { binding } = trackParams;
    this.trackParams = binding.value;
    // 指令埋点上报
    this.handleSendTrack(
      typeof this.trackParams == "string"
        ? {
            // 如果参数类型是字符串 那就是 页面名称
            pageName: this.trackParams,
          }
        : this.trackParams
    );
  }

  handleCustomBrowseEvent(trackParams) {
    this.handleSendTrack(trackParams);
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
        projectName: this.trackPlushConfig.projectName,
      },
      trackParams
    );

    createRequest({
      baseURL: this.trackPlushConfig.baseURL,
      url: this.trackPlushConfig.url,
      data: requestParams,
    });
  }
}
