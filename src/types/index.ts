export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface ExcelData {
  id: string;
  fileName: string;
  headers: string[];
  data: any[][];
  uploadedAt: Date;
  userId: string;
}

export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'doughnut';
  xAxis: string;
  yAxis: string;
  title: string;
  excelDataId: string;
  userId: string;
  createdAt: Date;
}

export interface AnalysisHistory {
  id: string;
  fileName: string;
  chartType: string;
  xAxis: string;
  yAxis: string;
  createdAt: Date;
  downloadCount: number;
}