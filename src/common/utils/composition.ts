import { unref } from '@vue/composition-api'

interface plainObj {
  [key: string]: any
}

export function unWrapObj(obj: plainObj) {
  return Object.keys(obj).reduce((prev: plainObj, cur: string | number) => {
    prev[cur] = unref(obj[cur])
    return prev
  }, {} as plainObj)
}
