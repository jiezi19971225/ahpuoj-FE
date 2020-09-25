import request from 'common/axios';

export function getSettings() {
  return request('GET', 'admin/settings');
}
export function setSettings(data) {
  return request('PUT', 'admin/settings', data);
}
