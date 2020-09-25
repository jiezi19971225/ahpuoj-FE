import Vue from 'vue';


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import SvgIcon from 'common/components/svgicon.vue';
import Base from 'common/base';
import VueCodemirror from 'vue-codemirror';
import store from './store';
import 'codemirror/lib/codemirror.css';

import '@babel/polyfill';
import router from './router';
import App from './App.vue';

Vue.use(ElementUI);
Vue.use(VueCodemirror);
Vue.use(Base); // 注册的全局函数

// Vue.config.productionTip = false
Vue.config.devtools = true;

// svg图标
Vue.component('svg-icon', SvgIcon);
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context('common/assets/icons', false, /\.svg$/);
requireAll(req);


// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
