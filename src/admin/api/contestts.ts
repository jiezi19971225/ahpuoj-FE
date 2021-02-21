import { get, post, put, del } from '../../common/axios/request'

/** 创建竞赛 */
export const createContest = post(`/admin/contest`)
/** 编辑竞赛 */
export const editContest = id => put(`/admin/contest/${id}`)
/** 获取竞赛 */
export const getContest = id => get(`/admin/contest/${id}`)
/** 获取竞赛分页列表 */
export const getContestList = get(`/admin/contests`)
/** 获取全部竞赛 */
export const getAllContests = get(`/admin/allcontests`)
/** 删除竞赛 */
export const deleteContest = id => del(`/admin/contest/${id}`)
/** 更改竞赛状态 */
export const toggleContestStatus = id => put(`/admin/contest/${id}/status`)
/** 获取竞赛用户列表 */
export const getContestUserList = id => get(`/admin/contest/${id}/users`)
/** 竞赛添加用户 */
export const addContestUser = id => post(`/admin/contest/${id}/users`)
/** 删除竞赛用户 */
export const deleteContestUser = (contestId, userId) =>
  del(`/admin/contest/${contestId}/user/${userId}`)
/** 获取竞赛团队 */
export const getContestTeams = id => get(`/admin/contest/${id}/teams`)
/** 添加竞赛团队 */
export const addContestTeam = (contestId, teamId) =>
  post(`/admin/contest/${contestId}/team/${teamId}`)
/** 删除竞赛团队 */
export const deleteContestTeam = (contestId, teamId) =>
  del(`admin/contest/${contestId}/team/${teamId}`)
/** 添加竞赛团队用户 */
export const addContestTeamUsers = (contestId, teamId) =>
  post(`admin/contest/${contestId}/team/${teamId}/users`)
/** 竞赛添加团队全部用户 */
export const addContestTeamAllUsers = (contestId, teamId) =>
  post(`/admin/contest/${contestId}/team/${teamId}/allusers`)
/** 删除竞赛团队用户 */
export const deleteContestTeamUser = (contestId, teamId, userId) =>
  del(`/admin/contest/${contestId}/team/${teamId}/user/${userId}`)
