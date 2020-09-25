import variables from 'admin/styles/element-variables.scss';
import defaultSettings from 'admin/settings';

const {
  showSettings, tagsView, fixedHeader, sidebarLogo,
} = defaultSettings;

const initState = {
  theme: variables.theme,
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data);
  },
};

export default {
  namespaced: true,
  state: initState,
  mutations,
  actions,
};
