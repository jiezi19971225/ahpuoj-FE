import request from 'common/axios';

export function createSeries(data) {
  return request('POST', 'admin/series', data);
}
export function editSeries(id, data) {
  return request('PUT', `admin/series/${id}`, data);
}
export function getSeries(id) {
  return request('GET', `admin/series/${id}`);
}
export function getSeriesList(page, perpage, queryParam) {
  return request('GET', 'admin/serieses', {
    page,
    perpage,
    param: queryParam,
  });
}
export function getSeriesContestList(id, page, perpage, queryParam) {
  return request('GET', `admin/series/${id}/contests`, {
    page,
    perpage,
    param: queryParam,
  });
}
export function getAllSeriess() {
  return request('GET', 'admin/allserieses');
}
export function deleteSeries(id) {
  return request('DELETE', `admin/series/${id}`);
}
export function toggleSeriesStatus(id) {
  return request('PUT', `admin/series/${id}/status`);
}
export function addSeriesContest(seriesId, contestId) {
  return request('POST', `admin/series/${seriesId}/contest/${contestId}`);
}
export function deleteSeriesContest(seriesId, contestId) {
  return request('DELETE', `admin/series/${seriesId}/contest/${contestId}`);
}
