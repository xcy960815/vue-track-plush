import request from './fetch'

// 页面浏览
export default class Browse {
    constructor(trackPlushConfig) {
        this.trackPlushConfig = trackPlushConfig || {}
    }
    // 处理浏览事件
    handleBrowseEvent(entry) {
        if (entry.type === 'customize') {
            this.track({
                pageName: entry.pageName, //页面名称
                userAgent:
                    this.trackPlushConfig.userAgent || navigator.userAgent, //客户端设备
                pageUrl: this.trackPlushConfig.pageUrl || window.location.href, //当前页面路径
                projectName: this.trackPlushConfig.projectName, //项目名称
                actionType: '浏览事件',
            })
        } else {
            const trackParams = entry.el.attributes['track-params']
            const pageName = trackParams ? trackParams.value : null
            this.track({
                pageName, //页面名称
                userAgent:
                    this.trackPlushConfig.userAgent || navigator.userAgent, //客户端设备
                pageUrl: this.trackPlushConfig.pageUrl || window.location.href, //当前页面路径
                projectName: this.trackPlushConfig.projectName, //项目名称
                actionType: '浏览事件',
            })
        }
    }

    /**
     * 事件上报
     * @param {Object} data
     */
    track(data) {
        new request({
            timeout: 10000,
            baseURL: this.trackPlushConfig.baseURL,
            withCredentials: true,
            url: this.trackPlushConfig.url,
            method: this.trackPlushConfig.method || 'post',
            data,
        })
    }
}
