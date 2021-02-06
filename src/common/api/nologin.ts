import { get } from '@common/axios/request'

export const nologinApi = {
  /** 获取可用语言列表 */
  getLanguageList: get('/languages'),
}
