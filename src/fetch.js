export const createRequest = (requestConfig) => {
  // 设置请求url
  const url = `${requestConfig.baseURL ? requestConfig.baseURL : ""}${
    requestConfig.url ? requestConfig.url : ""
  }`;
  const blob = new Blob([JSON.stringify(requestConfig.data || {})], {
    type: "application/json",
  });
  navigator.sendBeacon(url, blob);
};
