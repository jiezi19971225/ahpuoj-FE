import { instance } from '../../src/common/axios/request'

instance.defaults.baseURL = 'http://127.0.0.1:8080/api/'
instance.defaults.adapter = require('axios/lib/adapters/http')

const adminToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjIxMDk0MDYxfQ.cLpHKWq2HkJg7N9zc4FOiMTu-DWCL35YHTmvoBM7TfA`
instance.defaults.headers.Authorization = adminToken

const generateRandomString = length => {
  const pool = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let res = ''
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    const randIndex = Math.ceil(Math.random() * 1000) % 36
    res += pool[randIndex]
  }
  console.log(res)
  return res
}

export { instance, generateRandomString }
