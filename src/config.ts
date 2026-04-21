// 动态获取当前访问的域名/IP，并替换端口为 3000
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // 保持协议一致（http/https），主机名一致，端口固定为后端端口 3000
    return `${protocol}//${hostname}:3000`;
  }
  return 'http://localhost:3000';
};

export const API_BASE_URL = getBaseUrl();
export const SOCKET_URL = getBaseUrl();
