import 'intersection-observer'
import {
    createRequest
} from './fetch'
// 节流时间调整，默认100ms
IntersectionObserver.prototype['THROTTLE_TIMEOUT'] = 300

export default class Exposure {
    constructor(trackPlushConfig) {
        this.trackPlushConfig = trackPlushConfig
        this.cacheDataArr = []
        this.maxNum = trackPlushConfig.maxNum || 20
        this._timer = 0
        this._observer = null
        this.init()
    }

    /**
     * 初始化
     */
    init() {
        const self = this
        // 边界处理
        this.trackFromLocalStorage()
        this.beforeLeaveWebview()

        // 实例化监听
        this._observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach((entry) => {
                    // 出现在视窗中
                    if (entry.isIntersecting) {
                        // 清除当前定时器
                        clearInterval(self._timer)
                        const trackParams =
                            entry.target.attributes['track-params']
                        // 获取参数
                        const tp = trackParams ? trackParams.value : null
                        // 收集参数统一上报，减少网络请求
                        self.cacheDataArr.push(tp)
                        // 曝光之后取消观察
                        self._observer.unobserve(entry.target)
                        // 当储存的数量达到了最大上传存储量的时候 进行上报
                        if (self.cacheDataArr.length >= self.maxNum) {
                            self.track()
                        } else {
                            self.storeIntoLocalStorage(self.cacheDataArr)
                            if (self.cacheDataArr.length > 0) {
                                // 每2秒上报一次
                                self._timer = setInterval(function () {
                                    self.track()
                                }, 2000)
                            }
                        }
                    }
                })
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            }
        )
    }

    /**
     * 给元素添加监听
     * @param {Element} entry
     */
    handleExposureEvent(entry) {
        if (!this._observer) return
        // 支持以字符串或对象形式传递 track-params
        const attrs = entry && entry.el && entry.el.attributes
        if (attrs && !attrs['track-params'] && entry.el.__vtpTrackParams) {
            // 为了在 observer 回调中可读取到值，临时写入 attribute
            try {
                const v = typeof entry.el.__vtpTrackParams === 'string' ? entry.el.__vtpTrackParams : JSON.stringify(entry.el.__vtpTrackParams)
                entry.el.setAttribute('track-params', v)
            } catch (e) {}
        }
        this._observer.observe(entry.el)
    }
    /**
     * 埋点上报
     */
    track() {
        const data = this.cacheDataArr.splice(0, this.maxNum)
        if (!data || data.length === 0) return
        // 按批次上报曝光事件
        createRequest({
            timeout: 10000,
            baseURL: this.trackPlushConfig.baseURL,
            withCredentials: true,
            url: this.trackPlushConfig.url,
            method: this.trackPlushConfig.method || 'post',
            data: {
                actionType: '曝光事件',
                projectName: this.trackPlushConfig.projectName,
                userAgent: this.trackPlushConfig.userAgent || navigator.userAgent,
                pageUrl: this.trackPlushConfig.pageUrl || window.location.href,
                list: data
            },
        })
        // 更新localStorage
        this.storeIntoLocalStorage(this.cacheDataArr)
    }

    /**
     * 存储到localstorage, 防止在设定上报时间内用户退出
     * @param { Arrary } data
     */
    storeIntoLocalStorage(data) {
        try {
            window.localStorage.setItem('cacheTrackData', JSON.stringify(data || []))
        } catch (e) {}
    }

    /**
     * 首次进入先获取localStorage中的数据，也就是用户上次退出未上报的数据
     */
    trackFromLocalStorage() {
        try {
            const cacheData = window.localStorage.getItem('cacheTrackData')
            if (cacheData) {
                const list = JSON.parse(cacheData)
                if (Array.isArray(list) && list.length > 0) {
                    this.cacheDataArr.push(...list)
                    this.track()
                    window.localStorage.removeItem('cacheTrackData')
                }
            }
        } catch (e) {}
    }

    /**
     * 用户退出系统时调用方法，需要和客户端同学协商注册事件
     */
    beforeLeaveWebview() {
        // 客户端自定义事件监听上报
    }
}