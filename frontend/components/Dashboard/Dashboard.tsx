import React from 'react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { FileSpreadsheet, BarChart3, Download, Users } from 'lucide-react';
import { AnalysisHistory } from '../../types';

export const Dashboard: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const mockActivities: AnalysisHistory[] = [
    {
      id: '1',
      fileName: 'sales_data_2024.xlsx',
      chartType: 'bar',
      xAxis: 'Month',
      yAxis: 'Revenue',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      downloadCount: 3,
    },
    {
      id: '2',
      fileName: 'customer_analytics.xlsx',
      chartType: 'line',
      xAxis: 'Date',
      yAxis: 'Active Users',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      downloadCount: 1,
    },
    {
      id: '3',
      fileName: 'product_performance.xlsx',
      chartType: 'pie',
      xAxis: 'Product',
      yAxis: 'Sales',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      downloadCount: 7,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-gradient-y text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 transition-all duration-500">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400 animate-fade-in-up delay-100">Welcome back! Here's an overview of your analytics activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in delay-200">
          <StatsCard
            title="Files Uploaded"
            value={12}
            icon={FileSpreadsheet}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Charts Created"
            value={28}
            icon={BarChart3}
            color="green"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Downloads"
            value={156}
            icon={Download}
            color="purple"
            trend={{ value: 23, isPositive: true }}
          />
          <StatsCard
            title="Active Users"
            value={'1.2K'}
            icon={Users}
            color="orange"
            trend={{ value: -2, isPositive: false }}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity activities={mockActivities} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Upload New File</p>
                      <p className="text-sm text-blue-700">Start a new analysis</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Create Chart</p>
                      <p className="text-sm text-green-700">Generate visualization</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
              <p className="text-purple-100 text-sm mb-4">
                Get intelligent summaries and insights from your data with AI-powered analysis.
              </p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                Try AI Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};