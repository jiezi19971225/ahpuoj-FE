import request from 'common/axios';
import Cookies from 'js-cookie';

export function login(data) {
  return request('POST', 'login', data);
}
export function register(data) {
  return request('POST', 'register', data);
}
export function logout() {
  return Cookies.remove('access-token');
}

export function sendFindPassEmail(data) {
  return request('POST', 'findpass', data);
}

export function verifyResetPassToken(data) {
  return request('GET', `verifyresetpasstoken?token=${data}`);
}

export function resetPassByToken(data) {
  return request('POST', 'resetpassbytoken', data);
}
