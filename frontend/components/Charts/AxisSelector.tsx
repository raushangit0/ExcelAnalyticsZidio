import React from 'react';

interface AxisSelectorProps {
  headers: string[];
  xAxis: string;
  yAxis: string;
  onXAxisChange: (axis: string) => void;
  onYAxisChange: (axis: string) => void;
}

export const AxisSelector: React.FC<AxisSelectorProps> = ({
  headers,
  xAxis,
  yAxis,
  onXAxisChange,
  onYAxisChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="xAxis" className="block text-sm font-medium text-gray-300 mb-2">
          X-Axis (Horizontal)
        </label>
        <select
          id="xAxis"
          value={xAxis}
          onChange={(e) => onXAxisChange(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="">Select X-Axis column</option>
          {headers.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="yAxis" className="block text-sm font-medium text-gray-300 mb-2">
          Y-Axis (Vertical)
        </label>
        <select
          id="yAxis"
          value={yAxis}
          onChange={(e) => onYAxisChange(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="">Select Y-Axis column</option>
          {headers.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};