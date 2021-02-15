import { get, post, put, del } from '../../common/axios/request'

/** 创建团队 */
export const createTeam = post('/admin/team')
/** 团队添加成员 */
export const addTeamUser = id => post(`admin/team/${id}/users`)
/** 获取团队信息 */
export const getTeam = id => get(`admin/team/${id}`)
/** 编辑团队 */
export const editTeam = id => put(`admin/team/${id}`)
/** 获取团队分页列表 */
export const getTeamList = get(`/admin/teams`)
/** 获取所有团队列表 */
export const getAllTeams = get(`/admin/allteams`)
/** 获取团队成员列表 */
export const getTeamUserList = id => get(`admin/team/${id}/users`)
/** 删除团队 */
export const deleteTeam = id => del(`admin/team/${id}`)
/** 删除团队成员 */
export const deleteTeamUser = (teamId, userId) => del(`admin/team/${teamId}/user/${userId}`)
