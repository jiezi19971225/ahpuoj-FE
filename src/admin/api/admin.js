import request from 'common/axios';

// eslint-disable-next-line import/prefer-default-export
export function getSubmitStatistic() {
  return request('GET', 'admin/submitstatistic');
}
