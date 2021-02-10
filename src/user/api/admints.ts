import { put } from '@common/axios/request'
/** 切换主题状态 */
export const toggleIssueStatus = id => put(`admin/issue/${id}/status`)
/** 切换回复状态 */
export const toggleReplyStatus = id => put(`admin/reply/${id}/status`)
