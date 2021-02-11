import { get, put } from '@common/axios/request'

/** 获取设置 */
export const getSettings = get('/admin/settings')
/** 保存设置 */
export const setSettings = put('/admin/settings')
