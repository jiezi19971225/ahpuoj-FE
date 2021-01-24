import { unref } from '@vue/composition-api'

type plainObj = {
  [key in string | number]: any
}

export function unWrapObj(obj: plainObj) {
  return Object.keys(obj).reduce((prev: plainObj, cur: string | number) => {
    prev[cur] = unref(obj[cur])
    return prev
  }, {} as plainObj)
}
