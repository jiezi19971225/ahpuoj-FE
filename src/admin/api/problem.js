import request from 'common/axios';

export function createProblem(data) {
  return request('POST', 'admin/problem', data);
}
export function editProblem(id, data) {
  console.log(id, data);
  return request('PUT', `admin/problem/${id}`, data);
}
export function getProblem(id) {
  return request('GET', `admin/problem/${id}`);
}
export function getProblemList(page, perpage, queryParam) {
  return request('GET', 'admin/problems', {
    page,
    perpage,
    param: queryParam,
  });
}
export function deleteProblem(id) {
  return request('DELETE', `admin/problem/${id}`);
}
export function toggleProblemStatus(id) {
  return request('PUT', `admin/problem/${id}/status`);
}
export function getProblemDataList(id) {
  return request('GET', `admin/problem/${id}/datas`);
}
export function getProblemDataFile(id, filename) {
  return request('GET', `admin/problem/${id}/data/${filename}`);
}
export function editProblemData(id, filename, data) {
  return request('PUT', `admin/problem/${id}/data/${filename}`, data);
}
export function addProblemData(id, data) {
  return request('POST', `admin/problem/${id}/data`, data);
}
export function deleteProblemData(id, filename) {
  return request('DELETE', `admin/problem/${id}/data/${filename}`);
}
export function rejudgeSolution(id) {
  return request('PUT', `admin/solution/${id}/judgestatus`);
}
export function rejudgeProblem(id) {
  return request('PUT', `admin/problem/${id}/judgestatus`);
}
export function reassignProblem(oldId, newId) {
  return request('PUT', `admin/problem/${oldId}/movement/${newId}`);
}
