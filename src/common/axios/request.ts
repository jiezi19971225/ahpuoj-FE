import axios, { AxiosRequestConfig, Method } from 'axios'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import { unWrapObj } from 'common/utils/composition'
import dayjs from 'dayjs'
import { isObject } from 'lodash'

const baseURL = '/api'

const instance = axios.create()
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
  Message({
    message: err.response.data.message,
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

  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = ((await instance(httpDefault)) as unknown) as T
      successState(res)
      resolve(res)
    } catch (err) {
      errorState(err)
      reject(err)
    }
  })
}

export const get = (url: string) => <T>(payload = {}, options = {}) =>
  request<T>('get', url, payload, options)
export const post = (url: string) => <T>(payload = {}, options = {}) =>
  request<T>('post', url, payload, options)
