import request from '@common/axios'

export function getLanguageList() {
  return request('GET', 'languages')
}
