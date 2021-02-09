import { get } from '@common/axios/request'

/** 获取新闻列表 */
export const getNewList = get('/news')
/** 获取问题列表 */
export const getProblemList = get('/problems')
/** 获取问题 */
export const getProblem = id => get(`/problem/${id}`)
/** 获取竞赛问题 */
export const getContestProblem = (id, num) => get(`contest/${id}/problem/${num}`)
/** 获取标签列表 */
export const getAllTags = get('/alltags')
/** 获取跳转题目ID */
export const jumpProblem = get('/problemjump')
/** 获取评测记录列表 */
export const getSolutionList = get('/solutions')
