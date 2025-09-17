import { useState } from 'react';
import { FileUploadZone } from '../FileUpload/FileUploadZone';
import { ChartTypeSelector } from '../Charts/ChartTypeSelector';
import { AxisSelector } from '../Charts/AxisSelector';
import { ChartRenderer } from '../Charts/ChartRenderer';
import { ExcelData, ChartConfig } from '../../types';
import { Sparkles, Save } from 'lucide-react';

// Types
interface DataPreviewProps {
  data: ExcelData;
}

interface ChartControlsProps {
  excelData: ExcelData;
  chartConfig: ChartConfig;
  onConfigChange: (config: ChartConfig) => void;
  onGenerateChart: () => void;
  onSaveAnalysis: () => void;
  canGenerateChart: boolean;
  showChart: boolean;
}

// Components
const DataPreview = ({ data }: DataPreviewProps) => (
  <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
    <h4 className="font-medium text-gray-200 mb-2">File Preview</h4>
    <p className="text-sm text-gray-400 mb-2">
      Columns: {data.headers.length} | Rows: {data.data.length}
    </p>
    <div className="flex flex-wrap gap-1">
      {data.headers.slice(0, 5).map((header) => (
        <span key={header} className="px-2 py-1 bg-indigo-900/50 text-indigo-200 text-xs rounded border border-indigo-700">
          {header}
        </span>
      ))}
      {data.headers.length > 5 && (
        <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded border border-gray-700">
          +{data.headers.length - 5} more
        </span>
      )}
    </div>
  </div>
);

const PlaceholderContent = () => (
  <div className="max-w-md mx-auto">
    <Sparkles className="h-16 w-16 text-indigo-400 mx-auto mb-4 animate-pulse" />
    <h3 className="text-xl font-semibold text-gray-100 mb-2">Ready to Create</h3>
    <p className="text-gray-400">
      Upload an Excel file and configure your chart settings to generate beautiful visualizations
    </p>
  </div>
);

const ChartControls = ({
  excelData,
  chartConfig,
  onConfigChange,
  onGenerateChart,
  onSaveAnalysis,
  canGenerateChart,
  showChart,
}: ChartControlsProps) => (
  <div className="space-y-6">
    <div className="grid gap-4">
      <ChartTypeSelector 
        selectedType={chartConfig.type}
        onTypeChange={(type) => onConfigChange({ ...chartConfig, type })}
      />
      
      <AxisSelector
        headers={excelData.headers}
        xAxis={chartConfig.xAxis}
        yAxis={chartConfig.yAxis}
        onXAxisChange={(axis) => onConfigChange({ ...chartConfig, xAxis: axis })}
        onYAxisChange={(axis) => onConfigChange({ ...chartConfig, yAxis: axis })}
      />

      <div>
        <label htmlFor="chartTitle" className="block text-sm font-medium text-gray-300 mb-2">
          Chart Title
        </label>
        <input
          id="chartTitle"
          type="text"
          value={chartConfig.title}
          onChange={(e) => onConfigChange({ ...chartConfig, title: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
          placeholder="Enter chart title"
        />
      </div>
    </div>

    <div className="flex gap-3">
      <button
        onClick={onGenerateChart}
        disabled={!canGenerateChart}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition
          ${canGenerateChart 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
      >
        <Sparkles className="h-4 w-4" />
        Generate Chart
      </button>

      <button
        onClick={onSaveAnalysis}
        disabled={!showChart}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
          ${showChart 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
      >
        <Save className="h-4 w-4" />
        Save
      </button>
    </div>
  </div>
);

// Main component
export const AnalyticsWorkspace = () => {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    id: crypto.randomUUID(),
    type: 'bar',
    xAxis: '',
    yAxis: '',
    title: 'Untitled Chart',
    excelDataId: '',
    userId: 'current-user',
    createdAt: new Date(),
  });
  const [showChart, setShowChart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUploaded = (data: ExcelData) => {
    try {
      setIsLoading(true);
      setExcelData(data);
      setChartConfig(prev => ({
        ...prev,
        title: `Analysis of ${data.fileName}`,
        excelDataId: data.id,
      }));
      setShowChart(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateChart = () => {
    if (!excelData || !chartConfig.xAxis || !chartConfig.yAxis) return;
    setShowChart(true);
  };

  const handleSaveAnalysis = () => {
    if (!excelData) return;
    // In a real app, this would save to the backend
    console.log('Saving analysis:', { chartConfig, data: excelData });
    alert('Analysis saved successfully!');
  };

  const canGenerateChart = Boolean(
    excelData && 
    chartConfig.type && 
    chartConfig.xAxis && 
    chartConfig.yAxis
  );

  const renderChartDisplay = () => {
    if (showChart && excelData) {
      return (
        <div className="h-full min-h-[500px] bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <ChartRenderer
            config={chartConfig}
            excelData={excelData}
            onDownload={() => console.log('Chart downloaded:', chartConfig.title)}
          />
        </div>
      );
    }

    return (
      <div className="h-full min-h-[500px] bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 flex items-center justify-center p-8">
        <PlaceholderContent />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Analytics Workspace
          </h2>
          <p className="mt-2 text-gray-400">
            Upload your data, configure your chart, and generate insights
          </p>
        </div>

        {!excelData ? (
          <FileUploadZone onFileUploaded={handleFileUploaded} loading={isLoading} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <DataPreview data={excelData} />
              <ChartControls
                excelData={excelData}
                chartConfig={chartConfig}
                onConfigChange={setChartConfig}
                onGenerateChart={handleGenerateChart}
                onSaveAnalysis={handleSaveAnalysis}
                canGenerateChart={canGenerateChart}
                showChart={showChart}
              />
            </div>

            <div className="lg:col-span-2">
              {renderChartDisplay()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
