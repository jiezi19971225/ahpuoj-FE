import { getCurrentInstance } from '@vue/composition-api'

export * from './usePagenation'
export * from './useStore'
export * from './useRouter'
export * from './useLangList'

export const useVue = () => {
  return getCurrentInstance().proxy
}

export const useMessge = () => {
  return useVue().$message
}

export const useConfirm = () => {
  return useVue().$confirm
}

export const useLoading = () => {
  return useVue().$loading
}
