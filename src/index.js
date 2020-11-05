// import Vue from 'vue'
// import Exposure from './exposure'
import Click from './click'
import Browse from './browse'

const install = function (Vue, serverUrl) {
    Vue.directive('track', {
        bind(el, binding) {
            const { arg } = binding
            arg.split('|').forEach((item) => {
                // 点击
                if (item === 'click') {
                    new Click(serverUrl).handleClickEvent({
                        el,
                    })
                }
                // else if (item === 'exposure') {
                //     new Exposure(self.serverUrl).handleExposureEvent({
                //         el,
                //     })
                // }
                else if (item === 'browse') {
                    new Browse(serverUrl).handleBrowseEvent({
                        el,
                    })
                }
            })
        },
    })
}
export default { install }
