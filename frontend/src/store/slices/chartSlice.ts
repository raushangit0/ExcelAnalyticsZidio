import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chartService } from '../../services/chartService';
import { ChartConfig, AnalysisHistory } from '../../types';

interface ChartState {
  charts: ChartConfig[];
  history: AnalysisHistory[];
  currentChart: ChartConfig | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChartState = {
  charts: [],
  history: [],
  currentChart: null,
  loading: false,
  error: null,
};

export const createChart = createAsyncThunk(
  'charts/create',
  async (data: any) => {
    return await chartService.createChart(data);
  }
);

export const getUserCharts = createAsyncThunk(
  'charts/getUserCharts',
  async () => {
    return await chartService.getUserCharts();
  }
);

export const getHistory = createAsyncThunk(
  'charts/getHistory',
  async () => {
    return await chartService.getHistory();
  }
);

const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setCurrentChart: (state, action) => {
      state.currentChart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChart.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChart = action.payload;
        state.charts.push(action.payload);
      })
      .addCase(createChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Chart creation failed';
      })
      .addCase(getUserCharts.fulfilled, (state, action) => {
        state.charts = action.payload;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const { setCurrentChart } = chartSlice.actions;
export default chartSlice.reducer;