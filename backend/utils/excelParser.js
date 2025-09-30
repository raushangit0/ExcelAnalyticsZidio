const XLSX = require('xlsx');

exports.parseExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      throw new Error('Excel file is empty');
    }
    
    const headers = jsonData[0].filter(h => h);
    const data = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
    
    return {
      headers,
      data,
      rowCount: data.length,
      columnCount: headers.length,
    };
  } catch (error) {
    throw new Error('Failed to parse Excel file: ' + error.message);
  }
};