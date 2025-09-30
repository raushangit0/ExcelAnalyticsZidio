import api from './api';
import { ChartConfig, AnalysisHistory } from '../types';

interface CreateChartData {
  title: string;
  type: string;
  xAxis: string;
  yAxis: string;
  excelFileId: string;
  chartData: {
    labels: string[];
    values: number[];
  };
}

export const chartService = {
  async createChart(data: CreateChartData): Promise<ChartConfig> {
    const response = await api.post('/charts', data);
    return response.data.data;
  },

  async getChart(id: string): Promise<ChartConfig> {
    const response = await api.get(`/charts/${id}`);
    return response.data.data;
  },

  async getUserCharts(): Promise<ChartConfig[]> {
    const response = await api.get('/charts');
    return response.data.data;
  },

  async incrementDownload(id: string): Promise<void> {
    await api.put(`/charts/${id}/download`);
  },

  async deleteChart(id: string): Promise<void> {
    await api.delete(`/charts/${id}`);
  },

  async getHistory(): Promise<AnalysisHistory[]> {
    const response = await api.get('/charts/history');
    return response.data.data;
  },
};