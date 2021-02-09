import { ref } from '@vue/composition-api'
import * as nologinApi from 'common/api/nologin'

export const useLangList = () => {
  const langList = ref<LangListItem[]>([])
  nologinApi.getLanguageList<LangListResponse>().then(res => {
    langList.value = res.languages
  })
  return langList
}
