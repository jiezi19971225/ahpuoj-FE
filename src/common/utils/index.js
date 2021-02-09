import { staticAssetsBase } from '@common/const'

/**
 * @param {string} path
 * @returns {Boolean}
 */
// eslint-disable-next-line import/prefer-default-export
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** 转化相对url为绝对url */
export const getAbsoluteUrl = relativeUrl => staticAssetsBase + relativeUrl

/**
 * 将数字序号转化成字母表序号
 * @param {number} num 数字序号
 * @example
 * 1 => A
 * 3 => C
 */
export const getAlphabetNumber = num => {
  let alphtbetNumber = ''
  while (num) {
    alphtbetNumber = String.fromCharCode(64 + (num % 26)) + alphtbetNumber

    num = Math.floor(num / 26)
  }
  return alphtbetNumber
}
/**
 * 将秒数转化成时间格式化形式
 * @param {number} sec 秒数
 * @example
 * 3600 => 01:00:00
 */
export const secToTimeStr = sec => {
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
