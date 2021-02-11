import { get, post, put, del } from '@common/axios/request'

/** 创建标签 */
export const createTag = post(`admin/tag`)
/** 编辑标签 */
export const editTag = id => put(`/admin/tag/${id}`)
/** 获取标签列表 */
export const getTagList = get(`/admin/tags`)
/** 获取所有标签列表 */
export const getAllTags = get(`/admin/alltags`)
/** 删除标签 */
export const deleteTag = id => del(`admin/tag/${id}`)
