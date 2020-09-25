import request from 'common/axios';

export function createTeam(data) {
  return request('POST', 'admin/team', data);
}
export function addTeamUser(id, data) {
  return request('POST', `admin/team/${id}/users`, data);
}
export function getTeam(id) {
  return request('GET', `admin/team/${id}`);
}
export function editTeam(id, data) {
  return request('PUT', `admin/team/${id}`, data);
}
export function getTeamList(page, perpage, queryParam) {
  return request('GET', 'admin/teams', {
    page,
    perpage,
    param: queryParam,
  });
}
export function getAllTeams() {
  return request('GET', 'admin/allteams');
}
export function getTeamUserList(id, page, perpage, queryParam) {
  return request('GET', `admin/team/${id}/users`, {
    page,
    perpage,
    param: queryParam,
  });
}
export function deleteTeam(id) {
  return request('DELETE', `admin/team/${id}`);
}
export function deleteTeamUser(teamId, userId) {
  return request('DELETE', `admin/team/${teamId}/user/${userId}`);
}
