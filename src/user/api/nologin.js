import request from 'common/axios';

export function getLanguageList() {
  return request('GET', 'languages');
}
export function getRankList(data) {
  return request('GET', 'ranklist', data);
}
export function getNewList(data) {
  return request('GET', 'news', data);
}
export function getIssueList({ id, ...data }) {
  return request('GET', `problem/${id}/issues`, data);
}
export function getIssue({ id, ...data }) {
  return request('GET', `/issue/${id}`, data);
}
export function getProblem(id) {
  return request('GET', `problem/${id}`);
}
export function getProblemList(data) {
  return request('GET', 'problems', data);
}
export function getSolution(id) {
  return request('GET', `solution/${id}`);
}
export function getSolutionList(
  data,
) {
  return request('GET', 'solutions', data);
}
export function getContestList(data) {
  return request('GET', 'contests', data);
}
export function getContest(id) {
  return request('GET', `contest/${id}`);
}
export function getContestRankList(id) {
  return request('GET', `contest/${id}/ranklist`);
}
export function getContestTeamRankList(id) {
  return request('GET', `contest/${id}/teamranklist`);
}
export function getContestProblem(id, num) {
  return request('GET', `contest/${id}/problem/${num}`);
}
export function getSeriesList(data) {
  return request('GET', 'serieses', data);
}
export function getSeries(id) {
  return request('GET', `series/${id}`);
}
export function getAllTags() {
  return request('GET', 'alltags');
}
