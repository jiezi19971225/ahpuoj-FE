import request from 'common/axios';

export function generateCompeteAccount(data) {
  return request('POST', 'admin/generator/compete', data);
}

export function generateUserAccount(data) {
  return request('POST', 'admin/generator/user', data);
}
