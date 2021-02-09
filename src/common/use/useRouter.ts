import VueRouter, { Route } from 'vue-router'
import {
  computed,
  watchEffect,
  getCurrentInstance,
  ref,
  reactive,
  UnwrapRef,
  set,
} from '@vue/composition-api'

export const useRoute = () => {
  const vm = getCurrentInstance().proxy
  return computed(() => vm.$route as Route)
}

export const useRouter = () => {
  const vm = getCurrentInstance().proxy
  return vm.$router as VueRouter
}

export const useQuery = <T extends object>(params?: T) => {
  const route = useRoute()
  const query = ref<Route['query']>(route.value.query)

  watchEffect(() => {
    query.value = route.value.query
  })

  let queryParams: UnwrapRef<T>
  if (params) {
    queryParams = reactive({} as T)
    Object.keys(params).forEach(key => {
      set(queryParams, key, query.value[key] ?? '')
    })
  }

  return { query, queryParams }
}
