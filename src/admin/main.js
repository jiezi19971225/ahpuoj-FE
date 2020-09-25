import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import SvgIcon from 'common/components/svgicon.vue';
import Base from 'common/base';
import GlobalComponents from './globalComponents';

import '@babel/polyfill';
import router from './router';
import store from './store';
import App from './App.vue';

Vue.use(ElementUI);
Vue.use(Base); // 注册的全局函数
Vue.use(GlobalComponents);

// Vue.config.productionTip = false
Vue.config.devtools = true;

// svg图标
Vue.component('svg-icon', SvgIcon);
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context('common/assets/icons', false, /\.svg$/);
requireAll(req);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
