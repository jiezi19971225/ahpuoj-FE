import { get, post, put, del } from '../../common/axios/request'

/** 新建新闻 */
export const createNew = post('/admin/new')
/** 编辑新闻 */
export const editNew = id => put(`admin/new/${id}`)
/** 获取单条新闻 */
export const getNew = id => get(`admin/new/${id}`)
/** 获取新闻列表 */
export const getNewList = get(`/admin/news`)
/** 删除新闻 */
export const deleteNew = id => del(`admin/new/${id}`)
/** 切换新闻状态 */
export const toggleNewStatus = id => put(`/admin/new/${id}/status`)
/** 切换新闻置顶状态 */
export const toggleNewTopStatus = id => put(`admin/new/${id}/topstatus`)
