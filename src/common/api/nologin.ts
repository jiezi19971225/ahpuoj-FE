import { get } from '@common/axios/request'

/** 获取可用语言列表 */
export const getLanguageList = get('/languages')
