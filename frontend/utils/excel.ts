import * as XLSX from 'xlsx';
import { ExcelData } from '../types';

export const parseExcelFile = (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header option
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          throw new Error('Excel file is empty');
        }
        
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const excelData: ExcelData = {
          id: crypto.randomUUID(),
          fileName: file.name,
          headers: headers.filter(h => h), // Remove empty headers
          data: rows.filter(row => row.some(cell => cell !== undefined && cell !== '')), // Remove empty rows
          uploadedAt: new Date(),
          userId: 'current-user' // This would come from auth context
        };
        
        resolve(excelData);
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const downloadChart = (canvas: HTMLCanvasElement, fileName: string, format: 'png' | 'jpg' = 'png') => {
  const link = document.createElement('a');
  link.download = `${fileName}.${format}`;
  link.href = canvas.toDataURL(`image/${format}`);
  link.click();
};