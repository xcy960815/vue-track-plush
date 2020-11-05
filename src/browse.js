import request from './fetch'

// 页面浏览
export default class Browse {
    constructor(serverUrl) {
        this.serverUrl = serverUrl || ''
    }
    // 处理浏览事件
    handleBrowseEvent(entry) {
        const tp = entry.el.attributes['track-params'].value
        this.track(tp)
    }

    /**
     * 事件上报
     * @param {Object} data
     */
    track(data) {
        console.log(`Track data to server: ${JSON.stringify(data)}`)
        request({
            baseURL: this.serverUrl,
            withCredentials: true,
            url: 'track',
            method: 'post',
            data,
        })
    }
}
