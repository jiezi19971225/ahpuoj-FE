import { instance } from '../../src/common/axios/request'

instance.defaults.baseURL = 'http://127.0.0.1:8080/api/'
instance.defaults.adapter = require('axios/lib/adapters/http')

instance.defaults.headers.Authorization = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjIwNjA2NDc5fQ.hpvZsE1leD94FFlx2ISsF_zIB69P3B8hW_6UqCjpwPw`
