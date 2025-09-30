import api from './api';
import { ExcelData } from '../types';

export const fileService = {
  async uploadFile(file: File): Promise<ExcelData> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  async getFile(id: string): Promise<ExcelData> {
    const response = await api.get(`/files/${id}`);
    return response.data.data;
  },

  async getUserFiles(): Promise<ExcelData[]> {
    const response = await api.get('/files');
    return response.data.data;
  },

  async deleteFile(id: string): Promise<void> {
    await api.delete(`/files/${id}`);
  },
};