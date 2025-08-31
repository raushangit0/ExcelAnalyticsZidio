import React, { useState } from 'react';
import { FileUploadZone } from '../FileUpload/FileUploadZone';
import { ChartTypeSelector } from '../Charts/ChartTypeSelector';
import { AxisSelector } from '../Charts/AxisSelector';
import { ChartRenderer } from '../Charts/ChartRenderer';
import { ExcelData, ChartConfig } from '../../types';
import { Sparkles, Save } from 'lucide-react';

export const AnalyticsWorkspace: React.FC = () => {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    id: '',
    type: 'bar',
    xAxis: '',
    yAxis: '',
    title: 'Untitled Chart',
    excelDataId: '',
    userId: 'current-user',
    createdAt: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleFileUploaded = (data: ExcelData) => {
    setExcelData(data);
    setChartConfig(prev => ({
      ...prev,
      excelDataId: data.id,
      title: `Analysis of ${data.fileName}`,
    }));
  };

  const handleGenerateChart = () => {
    if (!excelData || !chartConfig.xAxis || !chartConfig.yAxis) {
      return;
    }
    
    setChartConfig(prev => ({
      ...prev,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }));
    setShowChart(true);
  };

  const handleSaveAnalysis = () => {
    // In a real app, this would save to the backend
    console.log('Saving analysis:', chartConfig);
    alert('Analysis saved successfully!');
  };

  const handleDownload = () => {
    // This would be tracked in the backend
    console.log('Chart downloaded');
  };

  const canGenerateChart = excelData && chartConfig.xAxis && chartConfig.yAxis;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Workspace</h1>
        <p className="text-gray-600">Upload your Excel file and create interactive visualizations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload & Configure</h2>
            
            <FileUploadZone onFileUploaded={handleFileUploaded} loading={loading} />
            
            {excelData && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">File Preview</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Columns: {excelData.headers.length} | Rows: {excelData.data.length}
                </p>
                <div className="flex flex-wrap gap-1">
                  {excelData.headers.slice(0, 5).map((header) => (
                    <span key={header} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {header}
                    </span>
                  ))}
                  {excelData.headers.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{excelData.headers.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {excelData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ChartTypeSelector
                selectedType={chartConfig.type}
                onTypeChange={(type) => setChartConfig(prev => ({ ...prev, type }))}
              />
              
              <div className="mt-6">
                <AxisSelector
                  headers={excelData.headers}
                  xAxis={chartConfig.xAxis}
                  yAxis={chartConfig.yAxis}
                  onXAxisChange={(axis) => setChartConfig(prev => ({ ...prev, xAxis: axis }))}
                  onYAxisChange={(axis) => setChartConfig(prev => ({ ...prev, yAxis: axis }))}
                />
              </div>

              <div className="mt-6">
                <label htmlFor="chartTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Title
                </label>
                <input
                  id="chartTitle"
                  type="text"
                  value={chartConfig.title}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter chart title"
                />
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleGenerateChart}
                  disabled={!canGenerateChart}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Chart</span>
                </button>
                
                {showChart && (
                  <button
                    onClick={handleSaveAnalysis}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Analysis</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Chart Display */}
        <div className="lg:col-span-2">
          {showChart && excelData ? (
            <ChartRenderer
              config={chartConfig}
              excelData={excelData}
              onDownload={handleDownload}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Create</h3>
                <p className="text-gray-600">
                  Upload an Excel file and configure your chart settings to generate beautiful visualizations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};