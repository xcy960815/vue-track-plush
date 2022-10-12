// import Exposure from './exposure'
import Click from "./click";
import Browse from "./browse";

// 忽略的字段
const ignoreField = ["baseURL", "url"];

// 指令 触发
const install = function (Vue, trackPlushConfig = {}) {
  Vue.directive("track", {
    bind(el, binding, VNode) {
      const { arg } = binding;

      arg.split("|").forEach((item) => {
        // 点击
        if (item === "click") {
          new Click(trackPlushConfig).handleClickEvent({
            el,
            VNode,
            type: "instruction",
          });
        }

        // 曝光
        // else if (item === 'exposure') {
        //     new Exposure(trackPlushConfig).handleExposureEvent({
        //         el,
        //     })
        // }

        // 浏览
        else if (item === "browse") {
          new Browse(trackPlushConfig).handleBrowseEvent({
            el,
            VNode,
            type: "instruction",
          });
        }
      });
    },
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

// 点击事件
export const clickEvent = (trackPlushConfig) => {
  const clickEventParams = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key))
      clickEventParams[key] = trackPlushConfig[key];
  });

  new Click(trackPlushConfig).handleClickEvent({
    ...clickEventParams,
    type: "customize",
  });
};

// 浏览事件
export const browseEvent = (trackPlushConfig) => {
  const browseEventParams = {};
  Object.keys(trackPlushConfig).forEach((key) => {
    if (!ignoreField.includes(key))
      browseEventParams[key] = trackPlushConfig[key];
  });

  new Browse(trackPlushConfig).handleBrowseEvent({
    ...browseEventParams,
    type: "customize",
  });
};

export default {
  install,
};
