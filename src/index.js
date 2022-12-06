// import Exposure from './exposure'
// 曝光
// else if (item === 'exposure') {
//     new Exposure(trackPlushConfig).handleExposureEvent({
//         el,
//     })
// }
// noinspection JSUnusedGlobalSymbols

import Click from "./click";

import Browse from "./browse";

// 指令 触发
export default class VueTrackPlush {
  #clickInstance;

  #browserInstance;
  static install(Vue, trackConfig = {}) {
    VueTrackPlush.prototype.clickInstance = Click.getInstance(trackConfig);

    VueTrackPlush.prototype.browserInstance = Browse.getInstance(trackConfig);

    Vue.directive("track", {
      bind(el, binding) {
        const { arg: handleType, value: trackParams } = binding;
        switch (handleType) {
          case "click":
            // 绑定点击事件
            VueTrackPlush.prototype.clickInstance.handleAddClickEvent({
              el,
              trackParams,
            });
            break;
          case "browse":
            VueTrackPlush.prototype.browserInstance.handleBrowseEvent(
              trackParams
            );
            break;
          // 曝光埋点
          // case 'exposure':
          //     Vue3TrackPlush.prototype.exposureInstance.handleExposureEvent({
          //         el,
          //         trackParams,
          //     })
          default:
            break;
        }
      },
      // 更新的时候
      update(el, binding) {
        const { arg: trackType, value, oldValue } = binding;
        if (JSON.stringify(value) !== JSON.stringify(oldValue)) {
          switch (trackType) {
            case "click":
              // 移除点击事件
              VueTrackPlush.prototype.clickInstance.handleRemoveClickEvent(el);
              // 绑定点击事件
              VueTrackPlush.prototype.clickInstance.handleAddClickEvent({
                el,
                trackParams: value,
              });
              break;
            case "browse":
              VueTrackPlush.prototype.browserInstance.handleBrowseEvent(value);
              break;
            // 曝光埋点
            // case 'exposure':
            //     Vue3TrackPlush.prototype.exposureInstance.handleExposureEvent({
            //         el,
            //         trackParams,
            //     })
            default:
              break;
          }
        }
      },
    });
  }
}

// 点击事件
export const clickEvent = (trackConfig) => {
  const clickInstance = new Click(trackConfig);
  const trackParams = {};
  Object.keys(trackConfig).forEach((key) => {
    if (!["baseURL", "url", "projectName"].includes(key)) {
      const value = trackConfig[key];
      trackParams[key] = value;
    }
  });
  clickInstance.handleSendTrack(trackParams);
};

// 浏览事件
export const browseEvent = (trackConfig) => {
  const browserInstance = new Browse(trackConfig);
  const trackParams = {};
  Object.keys(trackConfig).forEach((key) => {
    if (!["baseURL", "url", "projectName"].includes(key)) {
      const value = trackConfig[key];
      trackParams[key] = value;
    }
  });
  browserInstance.handleSendTrack(trackParams);
};
