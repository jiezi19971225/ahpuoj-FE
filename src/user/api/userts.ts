import { get, post } from '@common/axios/request'

/** 获取最新递交的源码 */
export const getLatestSource = id => get(`/problem/${id}/latestsource`)
/** 获取最近提交的比赛源码 */
export const getLatestContestSource = (id, num) => get(`/contest/${id}/problem/${num}/latestsource`)
/** 提交测试运行 */
export const submitTestRunCode = post('/testrun')
/** 提交评测 */
export const submitJudgeCode = post('/submit')