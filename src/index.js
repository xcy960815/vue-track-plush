// import Exposure from './exposure'
// 曝光
// else if (item === 'exposure') {
//     new Exposure(trackPlushConfig).handleExposureEvent({
//         el,
//     })
// }
import Click from "./click";
import Browse from "./browse";

// 指令 触发
const install = function (Vue, trackPlushConfig = {}) {
  const clickInstance = new Click(trackPlushConfig);
  const browseInstance = new Browse(trackPlushConfig);
  Vue.directive("track", {
    bind(el, binding, VNode) {
      const { arg: handleType } = binding;
      switch (handleType) {
        case "click":
          clickInstance.handleDirectiveClickEvent({
            el,
            VNode,
          });
          break;
        case "browse":
          browseInstance.handleDirectiveBrowseEvent({
            VNode,
          });
          break;
        default:
          break;
      }
    },
    // 更新的时候
    update(_el, binding, VNode) {
      const { arg: handleType } = binding;
      switch (handleType) {
        case "click":
          clickInstance.handleDirectiveClickEvent({
            el: undefined,
            VNode,
          });
          break;
        case "browse":
          browseInstance.handleDirectiveBrowseEvent({
            VNode,
          });
          break;
        default:
          break;
      }
    },
  });
};

// 忽略的字段
const ignoreField = ["baseURL", "url"];
// 点击事件
export const clickEvent = (trackPlushConfig) => {
  const clickEventParams = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key))
      clickEventParams[key] = trackPlushConfig[key];
  });

  new Click(trackPlushConfig).handleCustomClickEvent(clickEventParams);
};

// 浏览事件
export const browseEvent = (trackPlushConfig) => {
  const browseEventParams = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key))
      browseEventParams[key] = trackPlushConfig[key];
  });

  new Browse(trackPlushConfig).handleCustomBrowseEvent(browseEventParams);
};

export default {
  install,
};
