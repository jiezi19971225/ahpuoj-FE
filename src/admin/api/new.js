import request from 'common/axios'

export function createNew(data) {
  return request('POST', 'admin/new', data)
}
export function editNew(id, data) {
  console.log(id, data)
  return request('PUT', `admin/new/${id}`, data)
}
export function getNew(id) {
  return request('GET', `admin/new/${id}`)
}
export function getNewList(page, perpage, queryParam) {
  return request('GET', 'admin/news', {
    page,
    perpage,
    param: queryParam,
  })
}
export function deleteNew(id) {
  return request('DELETE', `admin/new/${id}`)
}
export function toggleNewStatus(id) {
  return request('PUT', `admin/new/${id}/status`)
}
export function toggleNewTopStatus(id) {
  return request('PUT', `admin/new/${id}/topstatus`)
}
