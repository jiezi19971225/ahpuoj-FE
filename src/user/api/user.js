import request from 'common/axios';

import axios from 'axios';

export function getUser() {
  return request('GET', 'user');
}
export function getUserInfo(id) {
  return request('GET', `user/${id}`);
}
export function getMyReplys(data) {
  return request('GET', 'myreplys', data);
}
export function submitTestRunCode(data) {
  return request('POST', 'testrun', data);
}
export function submitJudgeCode(data) {
  return request('POST', 'submit', data);
}
export function resetNick(data) {
  return request('PUT', 'user/nick', data);
}
export function resetPassword(data) {
  return request('PUT', 'user/password', data);
}
export function toggleSolutionStatus(id) {
  return request('PUT', `/solution/${id}/status`);
}
export function getLatestSource(id) {
  return request('GET', `/problem/${id}/latestsource`);
}
export function getLatestContestSource(id, num) {
  return request('GET', `/contest/${id}/problem/${num}/latestsource`);
}
export function postIssue(data) {
  return request('POST', '/issue', data);
}
export function replyToIssue(id, data) {
  return request('POST', `/issue/${id}/reply`, data);
}
export function downloadDatafile(problemId, solutionId, filename) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/api/datafile',
      params: {
        pid: problemId,
        sid: solutionId,
        filename,
      },
      responseType: 'blob',
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
