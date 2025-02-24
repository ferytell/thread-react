
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const excelExport = (data: any[], fileName: string, header?: any[]) => {
  // Convert JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add formatted headers (splitting camel case)
  const headers = Object.keys(data[0] || {}).map((key) =>
    key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())
  );

  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  // Apply Borders & Styling
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1'); // Get cell range
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell_address = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cell_address]) continue; // Skip empty cells

      worksheet[cell_address].s = {
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      };
    }
  }

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Convert to Blob and Download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.ms-excel;charset=utf-8' });
  saveAs(blob, `${fileName}.xlsx`);
};
