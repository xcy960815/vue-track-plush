import Axios from 'axios'

export default class Service {
    constructor(requestConfig) {
        this.requestConfig = requestConfig || {}
        this.initRequest()
    }
    initRequest() {
        // 创建实例
        const service = Axios.create()
        // 请求拦截
        service.interceptors.request.use(
            (config) => {
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
        service(this.requestConfig)
            .then((res) => {})
            .catch((error) => {
                console.error(error)
            })
    }
}
