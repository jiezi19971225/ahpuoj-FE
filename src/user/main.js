/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import SvgIcon from '@common/components/svgicon.vue'
import ECharts from 'vue-echarts'
import VueCodemirror from 'vue-codemirror'
import VueCompositionApi from '@vue/composition-api'
import VueClipboard from 'vue-clipboard2'
import store from './store'
import 'codemirror/lib/codemirror.css'
import router from './router'
import App from './App.vue'
import '@common/components'

Vue.use(ElementUI)
Vue.use(VueCompositionApi)
Vue.use(VueCodemirror)
Vue.use(VueClipboard)

// svg图标
Vue.component('svg-icon', SvgIcon)
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('common/assets/icons', false, /\.svg$/)
requireAll(req)

Vue.component('v-chart', ECharts)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
