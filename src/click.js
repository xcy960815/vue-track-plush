import {
    createRequest
} from './fetch'

export default class Click {
    constructor(trackPlushConfig) {
        this.trackPlushConfig = trackPlushConfig || {}
    }
    // 处理点击事件
    handleClickEvent(entry) {
        if (entry.type === 'customize') {
            // 删掉type属性 type属性 是自用的
            const currentEntry = JSON.parse(JSON.stringify(entry))
            delete currentEntry.type
            this.handleSendTrack({
                userAgent: this.trackPlushConfig.userAgent || navigator.userAgent,
                pageUrl: this.trackPlushConfig.pageUrl || window.location.href,
                projectName: this.trackPlushConfig.projectName,
                actionType: '点击事件',
                ...currentEntry
            })
        } else {
            // 指令埋点上报
            entry.el.addEventListener('click', () => {
                // 获取 节点上 track-params 属性的值 在html节点中 属性所对应的值 只能是字符串 不能传递复杂 数据
                const trackParams = entry.VNode.data.attrs['track-params']
                if (typeof trackParams == "string") {
                    // 如果参数是字符串 那这个参数就赋值给buttonName字段
                    this.handleSendTrack({
                        buttonName: trackParams,
                        userAgent: this.trackPlushConfig.userAgent || navigator.userAgent,
                        pageUrl: this.trackPlushConfig.pageUrl || window.location.href,
                        projectName: this.trackPlushConfig.projectName,
                        actionType: '点击事件',
                    })
                } else {
                    this.handleSendTrack({
                        userAgent: this.trackPlushConfig.userAgent || navigator.userAgent,
                        pageUrl: this.trackPlushConfig.pageUrl || window.location.href,
                        projectName: this.trackPlushConfig.projectName,
                        actionType: '点击事件',
                        ...trackParams,
                    })
                }

            })
        }
    }
    /**
     * 事件上报
     * @param {Object} trackParams
     */
    handleSendTrack(trackParams) {
        createRequest({
            baseURL: this.trackPlushConfig.baseURL,
            url: this.trackPlushConfig.url,
            method: this.trackPlushConfig.method || 'post',
            data: trackParams,
        })
    }
}