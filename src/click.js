import { createRequest } from "./fetch";

export default class Click {
  // 初始化配置
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

  // 处理指令点击事件
  handleDirectiveClickEvent(trackParams) {
    const { el, VNode } = trackParams;
    this.trackParams = VNode.data.attrs["track-params"];
    if (!!el) {
      el.addEventListener("click", () => {
        this.handleSendTrack(
          typeof this.trackParams == "string"
            ? {
                buttonName: this.trackParams,
              }
            : this.trackParams
        );
      });
    }
  }

  // 处理点击事件
  handleCustomClickEvent(trackParams) {
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
        actionType: "点击事件",
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
