export const createRequest = (requestConfig) => {
    const xhr = new XMLHttpRequest()
    // 设置请求超时时间
    xhr.timeout = 10000

    // 设置请求url
    const url = `${requestConfig.baseUrl ? requestConfig.baseUrl : ""}${requestConfig.url ? requestConfig.url : ""}`

    // 设置请求方法
    const method = requestConfig.method.toUpperCase() || 'POST'

    // 发起请求
    xhr.open(method, url, true)

    // 设置请求携带cookie
    xhr.withCredentials = true

    // 设置content-type
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')

    // 发送数据
    xhr.send(JSON.stringify(requestConfig.data || {}))


}