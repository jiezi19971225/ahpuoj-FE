import request from 'common/axios';

export function createContest(data) {
  return request('POST', 'admin/contest', data);
}
export function editContest(id, data) {
  console.log(id, data);
  return request('PUT', `admin/contest/${id}`, data);
}
export function getContest(id) {
  return request('GET', `admin/contest/${id}`);
}
export function getContestList(page, perpage, queryParam) {
  return request('GET', 'admin/contests', {
    page,
    perpage,
    param: queryParam,
  });
}
export function getAllContests() {
  return request('GET', 'admin/allcontests');
}
export function deleteContest(id) {
  return request('DELETE', `admin/contest/${id}`);
}
export function toggleContestStatus(id) {
  return request('PUT', `admin/contest/${id}/status`);
}
export function getContestUserList(id, page, perpage, queryParam) {
  return request('GET', `admin/contest/${id}/users`, {
    page,
    perpage,
    param: queryParam,
  });
}
export function addContestUser(id, data) {
  return request('POST', `admin/contest/${id}/users`, data);
}
export function deleteContestUser(contestId, userId) {
  return request('DELETE', `admin/contest/${contestId}/user/${userId}`);
}
export function getContestTeams(id) {
  return request('GET', `admin/contest/${id}/teams`);
}
export function addContestTeam(contestId, teamId) {
  return request('POST', `admin/contest/${contestId}/team/${teamId}`);
}
export function deleteContestTeam(contestId, teamId) {
  return request('DELETE', `admin/contest/${contestId}/team/${teamId}`);
}
export function addContestTeamUsers(contestId, teamId, data) {
  return request(
    'POST',
    `admin/contest/${contestId}/team/${teamId}/users`,
    data,
  );
}
export function addContestTeamAllUsers(contestId, teamId) {
  return request('POST', `admin/contest/${contestId}/team/${teamId}/allusers`);
}
export function deleteContestTeamUser(contestId, teamId, userId) {
  return request(
    'DELETE',
    `admin/contest/${contestId}/team/${teamId}/user/${userId}`,
  );
}
