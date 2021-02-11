import { get, post } from '@common/axios/request'

/** 获取角色列表 */
export const getRoleList = get('/admin/permission/rolelist')
/** 获取管理员列表 */
export const getAdminList = get('/admin/permission/adminlist')
/** 分配角色 */
export const assignRole = post('/admin/permission/assign')
/** 取消分配角色 */
export const unassignRole = post('/admin/permission/unassign')
