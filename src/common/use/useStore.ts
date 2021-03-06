import { getCurrentInstance, watch, reactive } from '@vue/composition-api'
import Vue from 'vue'

export const useStore = () => {
  const vm = getCurrentInstance().proxy
  return vm.$store
}

export const useDispatch = () => {
  return useStore().dispatch
}

/**
 * 暂时只支持对象形式
 * 返回被 reactive 包裹的对象
 * */
export const useMapState = <
  T extends object,
  R = {
    [P in keyof T]: any
  }
>(
  mapObj: T
) => {
  const store = useStore()
  const ret = reactive({})

  Object.keys(mapObj).forEach(key => {
    const mapFun = mapObj[key]
    watch(
      () => mapFun(store.state),
      () => {
        Vue.set(ret, key, mapFun(store.state))
      },
      {
        immediate: true,
      }
    )
  })

  return ret as R
}
