import { ref } from '@vue/composition-api'
import { useRoute } from './useRouter'

interface initParams {
  page?: number
  perpage?: number
  total?: number
}

export const usePagination = ({
  page: initPage,
  perpage: initPerpage,
  total: initTotal,
}: initParams) => {
  const route = useRoute()
  let { page: queryPage, perpage: queryPerpage } = route.value.query
  queryPage = queryPage ?? ''
  queryPerpage = queryPerpage ?? ''

  const page = ref<number>(Number(queryPage) || initPage || 1)
  const perpage = ref<number>(Number(queryPerpage) || initPerpage || 10)
  const total = ref<number>(initTotal || 0)
  const dataList = ref([])
  return {
    page,
    perpage,
    total,
    dataList,
  }
}
