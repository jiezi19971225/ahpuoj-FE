import { useMapState } from '@common/use/useStore'
import { secToTimeStr } from '@common/utils'
import { reactive, Ref, set } from '@vue/composition-api'
import { problemColumnIOffset } from '../constants'

export const useTableStyle = (dataList: Ref<RankListItem[]>) => {
  const firstBloods = reactive([])
  const states = useMapState({
    user: state => state.user,
  })

  const calcFirstBloods = () => {
    // 计算每个题目的 first blood
    dataList.value.forEach((item, i) => {
      item.ac_time.forEach((time, j) => {
        if (time > 0) {
          if (!firstBloods[j]) {
            set(firstBloods, j, {
              index: i,
              time,
            })
          } else if (time < firstBloods[j].time) {
            firstBloods[j].index = i
            firstBloods[j].time = time
          }
        }
      })
    })
  }

  const calcProblemStatus = (row, index) => {
    let res = ''
    if (row.ac_time[index - 1] > 0) {
      res += secToTimeStr(row.ac_time[index - 1])
    }
    if (row.wa_count[index - 1] > 0) {
      res += `(-${row.wa_count[index - 1]})`
    }
    return res
  }
  const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
    if (
      columnIndex >= problemColumnIOffset &&
      firstBloods[columnIndex - problemColumnIOffset] &&
      firstBloods[columnIndex - problemColumnIOffset].index === rowIndex
    ) {
      return 'background:#CCCCFF;'
    }

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
  const rowStyle = ({ row, rowIndex }) => {
    if (row.user.username === states.user.username) {
      return 'background: #f0f9eb;'
    }
  }
  return {
    calcFirstBloods,
    calcProblemStatus,
    cellStyle,
    rowStyle,
  }
}
