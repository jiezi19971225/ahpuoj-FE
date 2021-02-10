import request from '@common/axios'

export function getIssueList({ id, ...data }) {
  return request('GET', `problem/${id}/issues`, data)
}
export function getIssue({ id, ...data }) {
  return request('GET', `/issue/${id}`, data)
}
export function getSeriesList(data) {
  return request('GET', 'serieses', data)
}
export function getSeries(id) {
  return request('GET', `series/${id}`)
}
