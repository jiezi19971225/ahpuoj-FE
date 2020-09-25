import { login, register } from 'user/api/auth';
import { getUser } from 'user/api/user';
import Cookies from 'js-cookie';


const initState = {
  id: 0,
  username: '',
  nick: '',
  role: '',
  avatar: '',
  submit: 0,
  solved: 0,
  defunct: 1, // defunct = 1表示被封禁的状态
  token: Cookies.get('access-token'),
};
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER: (state, user) => {
    state.id = user.id;
    state.username = user.username;
    state.nick = user.nick;
    state.role = user.role;
    state.avatar = user.avatar;
    state.submit = user.submit;
    state.solved = user.solved;
    state.defunct = user.defunct;
  },
  SET_AVATAR: (state, path) => {
    state.avatar = path;
  },
};
const actions = {
  Login({ commit }, loginForm) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const res = await login(loginForm);
        const token = Cookies.get('access-token');
        const role = 'user';
        commit('SET_TOKEN', token);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  },
  Register({ commit }, registerForm) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const res = await register(registerForm);
        const token = Cookies.get('access-token');
        const role = 'user';
        commit('SET_TOKEN', token);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  },
  // 刷新token
  RefreshToken({ commit }, token) {
    commit('SET_TOKEN', token);
  },
  // 获取用户姓名权限头像信息
  GetUserInfo({ commit, state }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const res = await getUser();
        const { user } = res.data;
        commit('SET_USER', user);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  },
  // 更新用户信息
  UpdateUserInfo({ commit }, user) {
    commit('SET_USER', user);
  },
  // 更新用户头像
  UpdateUserAvatar({ commit }, path) {
    commit('SET_AVATAR', path);
  },
  // 登出
  Logout({ commit, state }) {
    commit('SET_TOKEN', '');
    commit('SET_USER', {
      username: '',
      nick: '',
      role: '',
      avatar: '',
      submit: 0,
      solved: 0,
      defunct: 1,
    });
    Cookies.remove('access-token');
  },
};

export default {
  namespaced: true,
  state: initState,
  actions,
  mutations,
};
