import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Scatter, Doughnut } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import { ChartConfig, ExcelData } from '../../types';
import { prepareChartData, getChartOptions } from '../../utils/chart';
import { downloadChart } from '../../utils/excel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartRendererProps {
  config: ChartConfig;
  excelData: ExcelData;
  onDownload: () => void;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ config, excelData, onDownload }) => {
  const chartRef = React.useRef<ChartJS | null>(null);

  React.useEffect(() => {
    // Cleanup previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  }, [config.type]); // Reinitialize when chart type changes

  const { labels, values } = prepareChartData(excelData, config);
  const options = getChartOptions(config);

  // Ensure we have valid data
  if (!labels.length || !values.length) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="text-center text-gray-400">
          <p>No data available for the selected configuration.</p>
          <p className="text-sm mt-2">Please check your axis selections and try again.</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: config.yAxis,
        data: values,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const handleDownload = () => {
    const chart = document.querySelector('.chart-container canvas');
    if (chart instanceof HTMLCanvasElement) {
      downloadChart(chart, `${config.title}_chart`);
    }
    onDownload();
  };

  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'scatter':
        return <Scatter data={{ datasets: [{ ...chartData.datasets[0], data: labels.map((_, i) => ({ x: i, y: values[i] })) }] }} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-100">{config.title}</h3>
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>
      
      <div className="chart-container w-full h-[420px] md:h-[600px] lg:h-[720px]">
        <div className="w-full h-full">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};