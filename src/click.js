import request from './fetch'

export default class Click {
    constructor(serverUrl) {
        this.serverUrl = serverUrl || ''
    }
    handleClickEvent(entry) {
        const tp = entry.el.attributes['track-params'].value
        entry.el.addEventListener('click', () => {
            this.track(tp)
        })
    }
    /**
     * 事件上报
     * @param {Object} data
     */
    track(data) {
        console.log(`Track data to server: ${JSON.stringify(data)}`)
        new request({
            baseURL: this.serverUrl,
            withCredentials: true,
            url: 'track',
            method: 'post',
            data,
        })
    }
}
