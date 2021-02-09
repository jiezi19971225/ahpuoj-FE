import { staticAssetsBase } from 'common/const'

const Base = {}
Base.install = Vue => {
  Vue.prototype.imgUrl = relativeUrl => staticAssetsBase + relativeUrl
  Vue.prototype.engNum = num => {
    let engNum = ''
    while (num) {
      engNum = String.fromCharCode(64 + (num % 26)) + engNum

      num = Math.floor(num / 26)
    }
    return engNum
  }
  Vue.prototype.secToTimeStr = sec => {
    let res = ''
    const days = Math.floor(sec / (24 * 3600))
    let left = sec % (24 * 3600)
    const hours = Math.floor(left / 3600)
    left %= 3600
    const minutes = Math.floor(left / 60)
    left %= 60
    const seconds = Math.round(left)

    if (days > 0) {
      res += `${days}d `
    }
    res += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`
    return res
  }
}

export default Base
