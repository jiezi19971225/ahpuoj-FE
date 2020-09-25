import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

const modulesFiles = require.context('./modules', true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((mds, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  mds[moduleName] = value.default;
  return mds;
}, {});

Vue.use(Vuex);
export default new Vuex.Store({
  modules,
  getters,
  strict: process.env.NODE_ENV !== 'production',
});
