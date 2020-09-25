import request from 'common/axios';

export function getRoleList() {
  return request('GET', 'admin/permission/rolelist');
}
export function getAdminList() {
  return request('GET', 'admin/permission/adminlist');
}
export function assignRole(data) {
  return request('POST', 'admin/permission/assign', data);
}
export function unassignRole(data) {
  return request('POST', 'admin/permission/unassign', data);
}
