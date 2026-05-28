import type { NormalizedTrackPlushConfig, RequestConfig, TrackTransport } from '../type';

export type Transport = TrackTransport;

export class ConsoleTransport implements Transport {
  /**
   * @param {RequestConfig} requestConfig Final request config printed to the console.
   * @returns {Promise<void>} Promise resolved after console output.
   */
  send(requestConfig: RequestConfig) {
    // Debug mode intentionally skips network requests and prints the final payload.
    console.info('[vue-track-plush][debug]', JSON.stringify(requestConfig.data, null, 2));
    return Promise.resolve();
  }
}

/**
 * @param {string} url Base request URL.
 * @param {Record<string, unknown>} [data] Query data appended for GET requests.
 * @returns {string} URL with serialized query parameters.
 */
const appendQuery = (url: string, data?: Record<string, unknown>) => {
  if (!data || Object.keys(data).length === 0) return url;

  const searchParams = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value === undefined || value === null) return;
    searchParams.append(key, typeof value === 'string' ? value : JSON.stringify(value));
  });

  const query = searchParams.toString();
  if (!query) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${query}`;
};

/**
 * @param {RequestConfig} [requestConfig] XHR request configuration for one tracking payload.
 * @returns {Promise<void>} Promise resolved on 2xx responses and rejected after retries are exhausted.
 */
export const createRequest = (requestConfig: RequestConfig = {}) =>
  new Promise<void>((resolve, reject) => {
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
      retryDelay = 300,
    } = requestConfig;

    if (!baseURL || !path) {
      reject(new Error('baseURL 属性或者 url 不能为空!'));
      return;
    }

    const methodUpper = method.toUpperCase();
    const requestUrl = `${baseURL}${path}`;

    const attempt = (left: number) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = timeout;
      xhr.open(methodUpper, methodUpper === 'GET' ? appendQuery(requestUrl, data) : requestUrl, true);
      xhr.withCredentials = withCredentials;
      xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

      Object.keys(headers).forEach((key) => {
        try {
          xhr.setRequestHeader(key, headers[key]);
        } catch (error) {
          // Ignore invalid custom headers so tracking does not break the host app.
        }
      });

      const retryOrFail = () => {
        if (left > 0) {
          window.setTimeout(() => attempt(left - 1), retryDelay);
        } else {
          onError?.(xhr);
          reject(xhr);
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;

        const ok = xhr.status >= 200 && xhr.status < 300;
        if (ok) {
          onSuccess?.(xhr);
          resolve();
        } else {
          retryOrFail();
        }
      };

      xhr.onerror = retryOrFail;
      xhr.ontimeout = retryOrFail;

      xhr.send(methodUpper === 'GET' ? null : JSON.stringify(data || {}));
    };

    attempt(retry);
  });

export class XhrTransport implements Transport {
  private config: NormalizedTrackPlushConfig;

  /**
   * @param {NormalizedTrackPlushConfig} config Plugin-level request configuration.
   */
  constructor(config: NormalizedTrackPlushConfig) {
    this.config = config;
  }

  /**
   * @param {RequestConfig} requestConfig Final tracking request config sent through XHR.
   * @returns {Promise<void>} Promise resolved when the request succeeds.
   */
  send(requestConfig: RequestConfig) {
    return createRequest({
      timeout: requestConfig.timeout || this.config.timeout || 10000,
      baseURL: requestConfig.baseURL || this.config.baseURL,
      withCredentials: requestConfig.withCredentials ?? this.config.withCredentials ?? true,
      url: requestConfig.url || this.config.url,
      method: requestConfig.method || this.config.method || 'post',
      headers: requestConfig.headers || this.config.headers,
      retry: requestConfig.retry ?? this.config.retry,
      retryDelay: requestConfig.retryDelay ?? this.config.retryDelay,
      data: requestConfig.data,
    });
  }
}
