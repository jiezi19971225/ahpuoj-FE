import axios, { AxiosRequestConfig, Method } from 'axios'
import { setupCache } from 'axios-cache-adapter'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import { unWrapObj } from 'common/utils/composition'
import dayjs from 'dayjs'
import { isObject, merge } from 'lodash'

const baseURL = '/api'
const cache = setupCache({
  maxAge: 0,
})

const instance = axios.create({
  adapter: cache.adapter,
})
const timeFields = ['created_at', 'updated_at']

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
    res = res.data
    // 转换时间格式
    const solve = obj => {
      Object.keys(obj).forEach(key => {
        if (isObject(obj[key])) {
          obj[key] = solve(obj[key])
        }
        if (typeof obj[key] === 'string' && timeFields.includes(key) && dayjs(obj[key]).isValid()) {
          obj[key] = dayjs(obj[key]).format('YYYY-MM-DD hh:mm:ss')
        }
      })
      return obj
    }
    return solve(res)
  },
  err => {
    return Promise.reject(err)
  }
)

function errorState(err) {
  let { message } = err.response.data
  if (err.response.data instanceof Blob) {
    message = '服务器发生错误'
  }
  Message({
    message,
    type: 'error',
  })
  return err
}

function successState(res) {
  if (res.show) {
    Message({
      message: res.message,
      type: 'success',
    })
  }
  return res
}

function request<T = object>(method: Method, url: string, payload = {}, options = {}) {
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

  return new Promise<T>((resolve, reject) => {
    instance(httpDefault)
      .then(res => {
        successState(res)
        resolve((res as unknown) as T)
      })
      .catch(err => {
        errorState(err)
        reject(err)
      })
  })
}

export const get = (url: string, defaultOptions?) => <T>(payload = {}, options = {}) =>
  request<T>('get', url, payload, merge(defaultOptions, options))
export const post = (url: string, defaultOptions?) => <T>(payload = {}, options = {}) =>
  request<T>('post', url, payload, merge(defaultOptions, options))
export const put = (url: string, defaultOptions?) => <T>(payload = {}, options = {}) =>
  request<T>('put', url, payload, merge(defaultOptions, options))
