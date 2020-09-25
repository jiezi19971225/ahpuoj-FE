import request from 'common/axios';

// eslint-disable-next-line import/prefer-default-export
export function getUser() {
  return request('GET', 'user');
}
