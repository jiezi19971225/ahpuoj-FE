import { computed, getCurrentInstance } from '@vue/composition-api'

export function useRoute() {
  const vm = getCurrentInstance().proxy
  return computed(() => vm.$route)
}

export function useRouter() {
  const vm = getCurrentInstance().proxy
  return vm.$router
}
