import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import SvgIcon from 'common/components/svgicon.vue'
import Base from 'common/base'
import ECharts from 'vue-echarts'
import VueCompositionApi from '@vue/composition-api'
import GlobalComponents from './globalComponents'
import router from './router'
import store from './store'
import App from './App.vue'
import '@common/components'

Vue.use(VueCompositionApi)
Vue.use(ElementUI)
Vue.use(Base) // 注册的全局函数
Vue.use(GlobalComponents)

// svg图标
Vue.component('svg-icon', SvgIcon)
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('common/assets/icons', false, /\.svg$/)
requireAll(req)

// echart图标
Vue.component('v-chart', ECharts)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
