import Exposure from './exposure'
import Click from "./click";
import Browse from "./browse";

// 忽略的字段
const ignoreField = ["baseURL", "url"];

// 指令 触发
const install = function (Vue, trackPlushConfig = {}) {
  Vue.directive("track", {
    bind(el, binding, VNode) {
      const { arg } = binding;

      // 初始化并缓存当前 track-params（支持对象/字符串）
      const attrs = (VNode && VNode.data && VNode.data.attrs) || {};
      el.__vtpTrackParams = attrs['track-params'] !== undefined
        ? attrs['track-params']
        : (el.getAttribute && el.getAttribute('track-params'));
      el.__vtpPrevTrackParamsString = typeof el.__vtpTrackParams === 'string'
        ? el.__vtpTrackParams
        : JSON.stringify(el.__vtpTrackParams || '');

      (arg || '').split("|").forEach((item) => {
        if (item === "click") {
          new Click(trackPlushConfig).handleClickEvent({
            el,
            VNode,
            type: "instruction",
          });
        } else if (item === 'exposure') {
          new Exposure(trackPlushConfig).handleExposureEvent({
            el,
          })
        } else if (item === "browse") {
          new Browse(trackPlushConfig).handleBrowseEvent({
            el,
            VNode,
            type: "instruction",
          });
        }
      });
    },
    update(el, binding, VNode) {
      const { arg } = binding;
      const attrs = (VNode && VNode.data && VNode.data.attrs) || {};
      const next = attrs['track-params'] !== undefined
        ? attrs['track-params']
        : (el.getAttribute && el.getAttribute('track-params'));

      const prevStr = el.__vtpPrevTrackParamsString;
      const nextStr = typeof next === 'string' ? next : JSON.stringify(next || '');

      // 覆盖为最新值，供 click/曝光读取
      el.__vtpTrackParams = next;
      el.__vtpPrevTrackParamsString = nextStr;

      // 对于浏览事件，当参数发生变化时重新上报一次
      if ((arg || '').split('|').includes('browse') && nextStr !== prevStr) {
        new Browse(trackPlushConfig).handleBrowseEvent({
          el,
          VNode,
          type: 'instruction',
        })
      }
    },
    unbind(el) {
      // 清理缓存字段
      delete el.__vtpTrackParams
      delete el.__vtpPrevTrackParamsString
    }
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
