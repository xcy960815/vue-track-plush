export const createRequest = (requestConfig) => {
  if (!requestConfig.baseURL || !requestConfig.url)
    throw new Error("baseURL属性或者url不能为空!");
  // 设置请求url
  const url = `${requestConfig.baseURL ? requestConfig.baseURL : ""}${
    requestConfig.url ? requestConfig.url : ""
  }`;
  const blob = new Blob([JSON.stringify(requestConfig.data || {})], {
    type: "application/json",
  });
  navigator.sendBeacon(url, blob);
};
