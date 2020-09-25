import request from 'common/axios';

export function editUser(id, data) {
  return request('PUT', `admin/user/${id}`, data);
}
export function getUser(id) {
  return request('GET', `admin/user/${id}`);
}
export function getUserList(page, perpage, userType, queryParam) {
  return request('GET', 'admin/users', {
    page,
    perpage,
    userType,
    param: queryParam,
  });
}
export function toggleUserStatus(id) {
  return request('PUT', `admin/user/${id}/status`);
}
export function changeUserPass(id, data) {
  return request('PUT', `admin/user/${id}/pass`, data);
}
