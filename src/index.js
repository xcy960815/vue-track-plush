// import Exposure from './exposure'
import Click from './click'
import Browse from './browse'

const install = function (Vue, trackPlushConfig) {
    Vue.directive('track', {
        bind(el, binding) {
            const { arg } = binding
            arg.split('|').forEach((item) => {
                // 点击
                if (item === 'click') {
                    new Click(trackPlushConfig).handleClickEvent({
                        el,
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
                        el,
                    })
                }
            })
        },
    })
}
export default { install }
