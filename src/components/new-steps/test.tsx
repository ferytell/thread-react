
import React, { ReactNode } from 'react';
import './CustomModal.css'; // Import CSS for styling

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="modal-overlay" onClick={onClose} aria-hidden="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  margin-top: 10px;
    }

// import * as XLSX from 'xlsx';

// export const exportToExcel = (data:any, fileName: string) => {
//   if (!data || data.length === 0) return;

//   // Convert JSON to worksheet
//   const worksheet = XLSX.utils.json_to_sheet(data);

//   // Extract headers
//   const headers = Object.keys(data[0]);

//   // Format headers (bold, black border)
//   headers.forEach((header, index) => {
//     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
//     if (!worksheet[cellAddress]) return;

//     worksheet[cellAddress].s = {
//       font: { bold: true },
//       border: {
//         top: { style: 'thin', color: { rgb: '000000' } },
//         bottom: { style: 'thin', color: { rgb: '000000' } },
//         left: { style: 'thin', color: { rgb: '000000' } },
//         right: { style: 'thin', color: { rgb: '000000' } },
//       },
//       alignment: { horizontal: 'center', vertical: 'center' }
//     };
//   });

//   // Apply borders to all cells
//   const range = XLSX.utils.decode_range(worksheet['!ref']);
//   for (let row = 0; row <= range.e.r; row++) {
//     for (let col = 0; col <= range.e.c; col++) {
//       const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
//       if (!worksheet[cellAddress]) continue;

//       worksheet[cellAddress].s = {
//         border: {
//           top: { style: 'thin', color: { rgb: '000000' } },
//           bottom: { style: 'thin', color: { rgb: '000000' } },
//           left: { style: 'thin', color: { rgb: '000000' } },
//           right: { style: 'thin', color: { rgb: '000000' } },
//         }
//       };
//     }
//   }

//   // Create a workbook and append the worksheet
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//   // Write the workbook and trigger download
//   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//   const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//   saveAs(blob, `${fileName}.xlsx`);
// };

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ExportToExcelOptions {
  datas: any[]; // Array of objects to export
  fileName: string; // Name of the Excel file
  sheetName?: string; // Name of the sheet (default: 'Sheet1')
}

export const exportToExcel = async ({
  datas,
  fileName,
  sheetName = "Sheet1",
}: ExportToExcelOptions) => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Add headers (first row)
  const headers = Object.keys(datas[0]);
  worksheet.addRow(headers);

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true }; // Bold text
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" }, // Gray background
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { horizontal: "center" }; // Center-align text
  });

  // Add data rows and apply borders to all cells
  datas.forEach((item) => {
    const row = headers.map((header) => item[header]);
    const addedRow = worksheet.addRow(row);

    // Apply borders to each cell in the data row
    addedRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Auto-fit columns for better readability
  worksheet.columns.forEach((column) => {
    if (column.eachCell) {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 2; // Add some padding
    }
  });

  // Generate the Excel file
  const buffer = await workbook.xlsx.writeBuffer();

  // Save the file using file-saver
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};
