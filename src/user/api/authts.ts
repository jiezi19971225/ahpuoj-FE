import { get, post, put } from '@common/axios/request'
import Cookies from 'js-cookie'
/** 登录 */
export const login = post('/login')
/** 注册 */
export const register = post('/register')
/** 登出 */
export const logout = () => {
  Cookies.remove('access-token')
}
/** 发送找回密码邮件 */
export const sendFindPassEmail = post('/findpass')
/** 发送找回密码邮件 */
export const verifyResetPassToken = token => get(`verifyresetpasstoken?token=${token}`)
/** 重设密码 */
export const resetPassByToken = post('/resetpassbytoken')
