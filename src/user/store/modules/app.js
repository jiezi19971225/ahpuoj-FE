import Cookies from 'js-cookie';

const app = {
  namespaced: true,
  state: {
    device: Cookies.get('device') || 'desktop',
  },
  mutations: {
    SET_DEVICE: (state, device) => {
      state.device = device;
      Cookies.set('device', device);
    },
  },
  actions: {
    setDevice({
      commit,
    }, device) {
      commit('SET_DEVICE', device);
    },
  },
};

export default app;
