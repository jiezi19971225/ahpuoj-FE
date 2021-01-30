import VueRouter, { Route } from 'vue-router'
import {
  computed,
  watchEffect,
  getCurrentInstance,
  ref,
  reactive,
  UnwrapRef,
} from '@vue/composition-api'

export function useRoute() {
  const vm = getCurrentInstance().proxy
  return computed(() => vm.$route as Route)
}

export function useRouter() {
  const vm = getCurrentInstance().proxy
  return vm.$router as VueRouter
}

export function useQuery<T extends object>(params?: T) {
  const route = useRoute()
  const query = ref<Route['query']>(route.value.query)

  watchEffect(() => {
    query.value = route.value.query
  })

  let queryParams: UnwrapRef<T>
  if (params) {
    queryParams = reactive({} as T)
    Object.keys(params).forEach(key => {
      queryParams[key] = query.value[key] ?? ''
    })
  }

  return { query, queryParams }
}
