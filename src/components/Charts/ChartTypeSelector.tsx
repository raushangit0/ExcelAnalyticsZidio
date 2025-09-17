import React from 'react';
import { BarChart3, LineChart, PieChart, ScatterChart as Scatter, Donut as Doughnut } from 'lucide-react';

type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'doughnut';

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  const chartTypes = [
    { type: 'bar' as ChartType, label: 'Bar Chart', icon: BarChart3 },
    { type: 'line' as ChartType, label: 'Line Chart', icon: LineChart },
    { type: 'pie' as ChartType, label: 'Pie Chart', icon: PieChart },
    { type: 'scatter' as ChartType, label: 'Scatter Plot', icon: Scatter },
    { type: 'doughnut' as ChartType, label: 'Doughnut', icon: Doughnut },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-100">Chart Type</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {chartTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              selectedType === type
                ? 'border-indigo-500 bg-indigo-900/50 text-indigo-200'
                : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
            }`}
          >
            <Icon className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};