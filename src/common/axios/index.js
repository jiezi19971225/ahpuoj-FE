import axios from 'axios';
import Cookies from 'js-cookie';
import { Message } from 'element-ui';

const baseURL = '/api';

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 如果本地有token
    if (Cookies.get('access-token')) {
      config.headers = {
        Authorization: Cookies.get('access-token'),
      };
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// // 添加响应拦截器
// axios.interceptors.response.use((res) => {
//     // 对响应数据做点什么
//     return res;
// }, (err) => {
//     return Promise.reject(err);
// });

// 前端消息提示
function errorState(err) {
  Message({
    message: err.response.data.message,
    type: 'error',
  });
  return err;
}

function successState(res) {
  if (res.data.show) {
    Message({
      message: res.data.message,
      type: 'success',
    });
  }
  return res;
}

// 封装axios
function request(method, url, payload) {
  const httpDefault = {
    method,
    baseURL,
    url,
    // `params` 是即将与请求一起发送的 URL 参数
    // `data` 是作为请求主体被发送的数据
    params: method === 'GET' || method === 'DELETE' ? payload : null,
    data: method === 'POST' || method === 'PUT' ? payload : null,
    timeout: 10000,
  };

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios(httpDefault);
      successState(res);
      resolve(res);
    } catch (err) {
      errorState(err);
      reject(err);
    }
  });
}

export default request;
