import { createRequest } from "./fetch";

export default class Click {
  // 初始化配置
  trackConfig = {
    baseURL: "",
    url: "",
    projectName: "",
  };

  trackParams = null;

  static instance;

  static getInstance(trackConfig) {
    if (!this.instance) {
      this.instance = new Click(trackConfig);
    }
    return this.instance;
  }

  constructor(trackConfig) {
    this.trackConfig = trackConfig;
  }

  /**
   * @description 添加点击事件
   * @returns {void}
   */
  handleAddClickEvent(params) {
    const { el, trackParams } = params;
    this.trackParams = trackParams;
    el.addEventListener("click", this.handleClickEvent);
  }
  /**
   * @description 移出点击事件
   * @returns {void}
   */
  handleRemoveClickEvent(el) {
    el.removeEventListener("click", this.handleClickEvent);
  }

  /**
   * @desc 处理指令点击事件
   * @param {{ el: HTMLElement  }} params
   */
  handleClickEvent = () => {
    this.handleSendTrack(
      typeof this.trackParams == "object"
        ? this.trackParams
        : { buttonName: this.trackParams }
    );
  };

  /**
   * @desc 事件上报
   * @param {Object} trackParams
   */
  handleSendTrack(trackParams) {
    const requestParams = Object.assign(
      {
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
        actionType: "点击事件",
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
