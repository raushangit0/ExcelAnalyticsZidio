import { ChartConfig, ExcelData } from '../types';

export const prepareChartData = (excelData: ExcelData, config: ChartConfig) => {
  const xIndex = excelData.headers.indexOf(config.xAxis);
  const yIndex = excelData.headers.indexOf(config.yAxis);
  
  if (xIndex === -1 || yIndex === -1) {
    throw new Error('Invalid axis selection');
  }
  
  const labels: string[] = [];
  const values: number[] = [];
  
  excelData.data.forEach(row => {
    const xValue = row[xIndex];
    const yValue = row[yIndex];
    
    if (xValue !== undefined && yValue !== undefined) {
      labels.push(String(xValue));
      values.push(Number(yValue) || 0);
    }
  });
  
  return { labels, values };
};

export const getChartOptions = (config: ChartConfig) => {
  const baseOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: config.title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: config.xAxis,
        },
      },
      y: {
        title: {
          display: true,
          text: config.yAxis,
        },
      },
    },
  };
  
  return baseOptions;
};