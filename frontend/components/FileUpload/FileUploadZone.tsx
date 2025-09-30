import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle } from 'lucide-react';
import { parseExcelFile } from '../../utils/excel';
import { ExcelData } from '../../types';

interface FileUploadZoneProps {
  onFileUploaded: (data: ExcelData) => void;
  loading: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileUploaded, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFiles = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setError('');
    setUploadedFile(file);

    try {
      const excelData = await parseExcelFile(file);
      onFileUploaded(excelData);
    } catch (err) {
      setError('Failed to parse Excel file. Please check the file format.');
      setUploadedFile(null);
    }
  }, [onFileUploaded]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const clearFile = () => {
    setUploadedFile(null);
    setError('');
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : uploadedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />
        
        {uploadedFile ? (
          <div className="space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <div>
              <p className="text-lg font-medium text-green-900">File uploaded successfully!</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span className="text-green-700">{uploadedFile.name}</span>
                <button
                  onClick={clearFile}
                  className="ml-2 p-1 hover:bg-green-100 rounded"
                >
                  <X className="h-4 w-4 text-green-600" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className={`h-12 w-12 mx-auto ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
            <div>
              <p className="text-lg font-medium text-gray-900">
                {dragActive ? 'Drop your Excel file here' : 'Upload Excel File'}
              </p>
              <p className="text-gray-600 mt-1">
                Drag and drop your .xlsx or .xls file, or click to browse
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Supports .xlsx and .xls formats</span>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Processing file...</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};