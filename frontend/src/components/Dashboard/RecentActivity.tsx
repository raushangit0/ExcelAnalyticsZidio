import React from 'react';
import { FileSpreadsheet, BarChart, Download, Clock } from 'lucide-react';
import { AnalysisHistory } from '../../types';

interface RecentActivityProps {
  activities: AnalysisHistory[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <FileSpreadsheet className="h-5 w-5 text-blue-600" />;
      case 'chart':
        return <BarChart className="h-5 w-5 text-green-600" />;
      case 'download':
        return <Download className="h-5 w-5 text-purple-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0">
                {getActivityIcon('chart')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Created {activity.chartType} chart for {activity.fileName}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.xAxis} vs {activity.yAxis} • Downloaded {activity.downloadCount} times
                </p>
              </div>
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-500">
                  {formatTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};