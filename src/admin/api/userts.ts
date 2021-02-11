import { get, put } from '@common/axios/request'

/** 编辑用户 */
export const editUser = id => put(`admin/user/${id}`)
/** 获取用户信息 */
export const getUser = id => get(`admin/user/${id}`)
/** 获取用户列表 */
export const getUserList = get(`admin/users`)
/** 切换用户状态 */
export const toggleUserStatus = id => put(`admin/user/${id}/status`)
/** 更改用户密码 */
export const changeUserPass = id => put(`admin/user/${id}/pass`)
