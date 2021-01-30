import { ref } from '@vue/composition-api'
import { useQuery } from './useRouter'

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
  const { queryParams } = useQuery({
    page: '',
    perpage: '',
  })

  const page = ref<number>(Number(queryParams.page) || initPage || 1)
  const perpage = ref<number>(Number(queryParams.perpage) || initPerpage || 10)
  const total = ref<number>(initTotal || 0)
  return {
    page,
    perpage,
    total,
  }
}
