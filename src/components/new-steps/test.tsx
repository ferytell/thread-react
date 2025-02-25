import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
  if (!data || data.length === 0) return;

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Extract headers
  const headers = Object.keys(data[0]);

  // Format headers (bold, black border)
  headers.forEach((header, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
    if (!worksheet[cellAddress]) return;
    
    worksheet[cellAddress].s = {
      font: { bold: true },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  });

  // Apply borders to all cells
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let row = 0; row <= range.e.r; row++) {
    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        }
      };
    }
  }

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Write the workbook and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};
