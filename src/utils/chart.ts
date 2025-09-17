import { ChartConfig, ExcelData } from '../types';

export const prepareChartData = (excelData: ExcelData, config: ChartConfig) => {
  const xIndex = excelData.headers.indexOf(config.xAxis);
  const yIndex = excelData.headers.indexOf(config.yAxis);
  
  if (xIndex === -1 || yIndex === -1) {
    console.warn('Invalid axis selection:', { xAxis: config.xAxis, yAxis: config.yAxis, headers: excelData.headers });
    return { labels: [], values: [] };
  }
  
  const labels: string[] = [];
  const values: number[] = [];
  
  excelData.data.forEach(row => {
    const xValue = row[xIndex];
    const yValue = row[yIndex];
    
    if (xValue !== undefined && yValue !== undefined) {
      const label = String(xValue).trim();
      const value = Number(yValue) || 0;
      
      if (config.type === 'pie' || config.type === 'doughnut') {
        // For pie/doughnut charts, aggregate values for same labels
        const existingIndex = labels.indexOf(label);
        if (existingIndex === -1) {
          labels.push(label);
          values.push(value);
        } else {
          values[existingIndex] += value;
        }
      } else {
        labels.push(label);
        values.push(value);
      }
    }
  });
  
  return { labels, values };
};

export const getChartOptions = (config: ChartConfig) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: config.title,
        color: '#f3f4f6',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#f3f4f6',
          font: {
            size: 12,
          }
        }
      },
    },
    scales: config.type !== 'pie' && config.type !== 'doughnut' ? {
      x: {
        title: {
          display: true,
          text: config.xAxis,
          color: '#f3f4f6',
        },
        ticks: {
          color: '#f3f4f6',
        },
        grid: {
          color: '#374151',
        }
      },
      y: {
        title: {
          display: true,
          text: config.yAxis,
          color: '#f3f4f6',
        },
        ticks: {
          color: '#f3f4f6',
        },
        grid: {
          color: '#374151',
        }
      }
    } : {}
  };
};