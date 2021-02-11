import { get, post, put, del } from '@common/axios/request'

/** 新建问题 */
export const createProblem = post(`/admin/problem`)
/** 编辑问题 */
export const editProblem = id => put(`/admin/problem/${id}`)
/** 获取问题 */
export const getProblem = id => get(`/admin/problem/${id}`)
/** 获取问题列表 */
export const getProblemList = get(`/admin/problems`)
/** 删除问题 */
export const deleteProblem = id => del(`/admin/problem/${id}`)
/** 切换问题状态 */
export const toggleProblemStatus = id => put(`/admin/problem/${id}/status`)
/**  获取问题列表 */
export const getProblemDataList = id => get(`/admin/problem/${id}/datas`)
/** 获取问题数据文件 */
export const getProblemDataFile = (id, filename) => get(`admin/problem/${id}/data/${filename}`)
/** 编辑数据文件 */
export const editProblemData = (id, filename) => put(`/admin/problem/${id}/data/${filename}`)
/** 添加问题数据文件 */
export const addProblemData = id => post(`/admin/problem/${id}/data`)
/** 删除问题数据文件 */
export const deleteProblemData = (id, filename) => del(`/admin/problem/${id}/data/${filename}`)
/** 重新评测提交 */
export const rejudgeSolution = id => put(`/admin/solution/${id}/judgestatus`)
/** 重新评测问题 */
export const rejudgeProblem = id => put(`/admin/problem/${id}/judgestatus`)
/** 重排问题 */
export const reassignProblem = (oldId, newId) => put(`/admin/problem/${oldId}/movement/${newId}`)
