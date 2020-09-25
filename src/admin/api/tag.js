import request from 'common/axios';

export function createTag(data) {
  return request('POST', 'admin/tag', data);
}
export function editTag(id, data) {
  return request('PUT', `admin/tag/${id}`, data);
}
export function getTagList(page, perpage, queryParam) {
  return request('GET', 'admin/tags', {
    page,
    perpage,
    param: queryParam,
  });
}
export function getAllTags() {
  return request('GET', 'admin/alltags');
}
export function deleteTag(id) {
  return request('DELETE', `admin/tag/${id}`);
}
