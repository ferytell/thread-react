import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export const excelExport = (data: any, fileName: string, header?: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  if (header) {
    header.forEach((x: any) => {
      XLSX.utils.sheet_add_aoa(worksheet, [[x.value]], { origin: x.cell })
    })
  }
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.ms-excel;charset=utf-8' })
  saveAs(blob, `${fileName}.xlsx`)
}
