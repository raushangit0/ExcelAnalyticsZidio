import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fileService } from '../../services/fileService';
import { ExcelData } from '../../types';

interface FileState {
  files: ExcelData[];
  currentFile: ExcelData | null;
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  currentFile: null,
  loading: false,
  error: null,
};

export const uploadFile = createAsyncThunk(
  'files/upload',
  async (file: File) => {
    return await fileService.uploadFile(file);
  }
);

export const getUserFiles = createAsyncThunk(
  'files/getUserFiles',
  async () => {
    return await fileService.getUserFiles();
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
        state.files.push(action.payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Upload failed';
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.files = action.payload;
      });
  },
});

export const { setCurrentFile, clearCurrentFile } = fileSlice.actions;
export default fileSlice.reducer;