import request from './fetch'

export default class Click {
    constructor(trackPlushConfig) {
        this.trackPlushConfig = trackPlushConfig || null
    }
    handleClickEvent(entry) {
        if (entry.type === 'customize') {
            this.track({
                buttonName: entry.buttonName,
                userAgent:
                    this.trackPlushConfig.userAgent || navigator.userAgent, //客户端设备
                pageUrl: this.trackPlushConfig.pageUrl || window.location.href, //当前页面路径
                projectName: this.trackPlushConfig.projectName, //项目名称
                actionType: '点击事件',
            })
        } else {
            const trackParams = entry.el.attributes['track-params']
            const buttonName = trackParams ? trackParams.value : null
            entry.el.addEventListener('click', () => {
                this.track({
                    buttonName,
                    userAgent:
                        this.trackPlushConfig.userAgent || navigator.userAgent, //客户端设备
                    pageUrl:
                        this.trackPlushConfig.pageUrl || window.location.href, //当前页面路径
                    projectName: this.trackPlushConfig.projectName, //项目名称
                    actionType: '点击事件',
                })
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
