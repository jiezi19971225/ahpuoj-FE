import OJPaginator from './Paginator/index.vue'
import Vue from 'vue'
import { VueConstructor } from 'vue/types/umd'

const components: {
  [key: string]: VueConstructor<Vue>
} = {
  'oj-paginator': OJPaginator,
}

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})
