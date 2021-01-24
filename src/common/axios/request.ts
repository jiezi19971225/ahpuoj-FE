import axios, { AxiosRequestConfig, Method } from 'axios'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import { unWrapObj } from 'common/utils/composition'

const baseURL = '/api'

const instance = axios.create()

instance.interceptors.request.use(
  config => {
    if (Cookies.get('access-token')) {
      config.headers = {
        Authorization: Cookies.get('access-token'),
      }
    }
    return config
  },
  err => Promise.reject(err)
)

instance.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    return Promise.reject(err)
  }
)

function errorState(err) {
  Message({
    message: err.response.data.message,
    type: 'error',
  })
  return err
}

function successState(res) {
  if (res.show) {
    Message({
      message: res.data.message,
      type: 'success',
    })
  }
  return res
}

function request(method: Method, url: string, payload = {}, options = {}) {
  const methodUpperCase = <string>method.toUpperCase()
  const httpDefault: AxiosRequestConfig = {
    method,
    baseURL,
    url,
    params: ['GET', 'DELETE'].includes(methodUpperCase) ? unWrapObj(payload) : null,
    data: ['POST', 'PUT'].includes(methodUpperCase) ? unWrapObj(payload) : null,
    timeout: 10000,
    ...options,
  }

  return new Promise(async (resolve, reject) => {
    try {
      const res = await instance(httpDefault)
      successState(res)
      resolve(res)
    } catch (err) {
      errorState(err)
      reject(err)
    }
  })
}

export const get = (url: string) => (payload = {}, options = {}) =>
  request('get', url, payload, options)
export const post = (url: string) => (payload = {}, options = {}) =>
  request('post', url, payload, options)
