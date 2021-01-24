import { ref } from '@vue/composition-api'

interface requestConfig {
  params: object
  options: object
  manual: boolean
}

export const useRequest = (fetchFn, config: requestConfig) => {
  let data
  const defaultConfig: requestConfig = {
    params: {},
    options: {},
    manual: false,
  }

  const mergedConfig = {
    ...defaultConfig,
    ...config,
  }

  if (!mergedConfig.manual) {
    data = fetchFn(mergedConfig.params, mergedConfig.options)
  }

  return fetchFn()
}
