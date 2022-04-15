// import Exposure from './exposure'
import Click from './click'
import Browse from './browse'

// 指令 触发
const install = function (Vue, trackPlushConfig = {}) {
    Vue.directive('track', {
        bind(el, binding) {
            const {
                arg
            } = binding
            arg.split('|').forEach((item) => {
                // 点击
                if (item === 'click') {
                    new Click(trackPlushConfig).handleClickEvent({
                        el,
                        type: 'instruction',
                    })
                }

                // 曝光
                // else if (item === 'exposure') {
                //     new Exposure(trackPlushConfig).handleExposureEvent({
                //         el,
                //     })
                // }

                // 浏览
                else if (item === 'browse') {
                    new Browse(trackPlushConfig).handleBrowseEvent({
                        type: 'instruction',
                        el,
                    })
                }
            })
        },
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

// 点击事件
export const clickEvent = (trackPlushConfig) => {
    new Click(trackPlushConfig).handleClickEvent({
        buttonName: trackPlushConfig.buttonName,
        type: 'customize',
    })
}

// 浏览事件
export const browseEvent = (trackPlushConfig) => {
    new Browse(trackPlushConfig).handleBrowseEvent({
        pageName: trackPlushConfig.pageName,
        type: 'customize',
    })
}

export default {
    install,
}