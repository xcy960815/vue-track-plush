export const createRequest = (requestConfig) => {
    const {
        baseURL,
        url: path,
        method = 'POST',
        data,
        withCredentials = true,
        timeout = 10000,
        headers = {},
        onSuccess,
        onError,
        retry = 0,
        retryDelay = 300
    } = requestConfig || {}

    if (!baseURL || !path) throw new Error("baseUrl属性或者url不能为空!")

    const url = `${baseURL || ""}${path || ""}`
    const methodUpper = (method || 'POST').toUpperCase()

    const attempt = (left) => {
        const xhr = new XMLHttpRequest()
        xhr.timeout = timeout
        xhr.open(methodUpper, url, true)
        xhr.withCredentials = !!withCredentials
        xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        // 自定义 headers
        Object.keys(headers || {}).forEach(k => {
            try { xhr.setRequestHeader(k, headers[k]) } catch (e) {}
        })

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const ok = xhr.status >= 200 && xhr.status < 300
                if (ok) {
                    onSuccess && onSuccess(xhr)
                } else if (left > 0) {
                    setTimeout(() => attempt(left - 1), retryDelay)
                } else {
                    onError && onError(xhr)
                }
            }
        }

        xhr.onerror = () => {
            if (left > 0) {
                setTimeout(() => attempt(left - 1), retryDelay)
            } else {
                onError && onError(xhr)
            }
        }

        xhr.ontimeout = () => {
            if (left > 0) {
                setTimeout(() => attempt(left - 1), retryDelay)
            } else {
                onError && onError(xhr)
            }
        }

        xhr.send(JSON.stringify(data || {}))
    }

    attempt(retry)
}