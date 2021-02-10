import request from 'common/axios'

export function getUser() {
  return request('GET', 'user')
}
export function getUserInfo(id) {
  return request('GET', `user/${id}`)
}
export function getMyReplys(data) {
  return request('GET', 'myreplys', data)
}
export function postIssue(data) {
  return request('POST', '/issue', data)
}
export function replyToIssue(id, data) {
  return request('POST', `/issue/${id}/reply`, data)
}
