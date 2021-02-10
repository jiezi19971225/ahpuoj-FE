import FileSaver from 'file-saver'
import XLSX from 'xlsx'

/**
 * 将 table 导出为 excel
 * @param {*} tableSelector table选择器
 * @param {*} filename 导出文件名
 */
export const handleExportTableToExcel = (tableSelector, filename) => {
  const wb = XLSX.utils.table_to_book(document.querySelector(tableSelector), {
    raw: true,
  })

  /* get binary string as output */
  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array',
  })
  try {
    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename)
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}
