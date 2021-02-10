import { secToTimeStr } from '@common/utils'
import { problemColumnIOffset } from '../constants'

export const useTableStyle = () => {
  const calcProblemStatus = (row, index) => {
    let res = ''
    if (row.ac_time[index - 1] > 0) {
      res += secToTimeStr(row.ac_time[index - 1])
      res += `(${row.ac_count[index - 1]})`
    }
    if (row.wa_count[index - 1] > 0) {
      res += `(-${row.wa_count[index - 1]})`
    }
    return res
  }
  const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
    // 从题目的列开始计算 这一段算法照搬的hustoj的
    if (columnIndex >= problemColumnIOffset) {
      if (row.ac_time[columnIndex - problemColumnIOffset] > 0) {
        let aa: number | string = 0x33 + row.wa_count[columnIndex - problemColumnIOffset] * 32
        aa = aa > 0xaa ? 0xaa : aa
        aa = aa.toString(16)
        const bgColor = `${aa}ff${aa}`
        return `background:#${bgColor};`
      }
      if (row.wa_count[columnIndex - problemColumnIOffset] > 0) {
        let aa: number | string = 0xaa - row.wa_count[columnIndex - problemColumnIOffset] * 10
        aa = aa > 16 ? aa : 16
        aa = aa.toString(16)
        const bgColor = `ff${aa}${aa}`
        return `background:#${bgColor};`
      }
    }
  }
  return {
    calcProblemStatus,
    cellStyle,
  }
}
