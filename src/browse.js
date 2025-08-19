import {
    createRequest
} from './fetch'

// 页面浏览
export default class Browse {
    constructor(trackPlushConfig) {
        this.trackPlushConfig = trackPlushConfig || {}
    }
    // 处理浏览事件
    handleBrowseEvent(entry) {
        if (entry.type === 'customize') {
            // 删掉type属性 type属性 是自用的
            const currentEntry = JSON.parse(JSON.stringify(entry))
            delete currentEntry.type
            this.handleSendTrack({
                userAgent: this.trackPlushConfig.userAgent || navigator.userAgent, //客户端设备
                pageUrl: this.trackPlushConfig.pageUrl || window.location.href, //当前页面路径
                projectName: this.trackPlushConfig.projectName, //项目名称
                actionType: '浏览事件',
                ...currentEntry
            })
        } else {
            // 指令埋点上报，支持动态 track-params
            const trackParams = entry.el.__vtpTrackParams !== undefined
                ? entry.el.__vtpTrackParams
                : (entry.VNode && entry.VNode.data && entry.VNode.data.attrs ? entry.VNode.data.attrs['track-params'] : undefined)
            if (typeof trackParams == "string") {
                this.handleSendTrack({
                    pageName: trackParams, // 如果参数类型是字符串 那就是 页面名称
                    userAgent: this.trackPlushConfig.userAgent || navigator.userAgent,
                    pageUrl: this.trackPlushConfig.pageUrl || window.location.href,
                    projectName: this.trackPlushConfig.projectName,
                    actionType: '浏览事件',
                })
            } else {
                this.handleSendTrack({
                    userAgent: this.trackPlushConfig.userAgent || navigator.userAgent,
                    pageUrl: this.trackPlushConfig.pageUrl || window.location.href,
                    projectName: this.trackPlushConfig.projectName,
                    actionType: '浏览事件',
                    ...trackParams,
                })
            }
        }
    }

    /**
     * 事件上报
     * @param {Object} trackParams
     */
    handleSendTrack(trackParams) {
        createRequest({
            timeout: 10000,
            baseURL: this.trackPlushConfig.baseURL,
            withCredentials: true,
            url: this.trackPlushConfig.url,
            method: this.trackPlushConfig.method || 'post',
            data: trackParams,
        })
    }
}