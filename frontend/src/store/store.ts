import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import fileReducer from './slices/fileSlice';
import chartReducer from './slices/chartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    charts: chartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType;
export type AppDispatch = typeof store.dispatch;