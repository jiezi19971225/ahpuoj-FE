import { get, post, put, del } from '@common/axios/request'

/** 创建系列赛 */
export const createSeries = post(`/admin/series`)
/** 编辑系列赛 */
export const editSeries = id => put(`/admin/series/${id}`)
/** 获取系列赛 */
export const getSeries = id => get(`/admin/series/${id}`)
/** 获取系列赛列表 */
export const getSeriesList = get(`/admin/serieses`)
/** 获取系列赛竞赛列表 */
export const getSeriesContestList = id => get(`/admin/series/${id}/contests`)
/** 获取全部系列赛 */
export const getAllSeriess = get(`/admin/allserieses`)
/** 删除系列赛 */
export const deleteSeries = id => del(`/admin/series/${id}`)
/** 切换系列赛状态 */
export const toggleSeriesStatus = id => put(`/admin/series/${id}/status`)
/** 系列赛 */
export const addSeriesContest = (seriesId, contestId) =>
  post(`/admin/series/${seriesId}/contest/${contestId}`)
/** 删除系列赛竞赛 */
export const deleteSeriesContest = (seriesId, contestId) =>
  del(`/admin/series/${seriesId}/contest/${contestId}`)
