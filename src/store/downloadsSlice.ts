import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DownloadItem } from '../types';

interface DownloadsState {
  items: Record<string, DownloadItem>;
}

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState: { items: {} } as DownloadsState,
  reducers: {
    addDownload(state, action: PayloadAction<DownloadItem>) {
      state.items[action.payload.id] = action.payload;
    },
    updateProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
      if (state.items[action.payload.id]) {
        state.items[action.payload.id].progress = action.payload.progress;
      }
    },
    setStatus(state, action: PayloadAction<{ id: string; status: DownloadItem['status']; error?: string }>) {
      if (state.items[action.payload.id]) {
        state.items[action.payload.id].status = action.payload.status;
        if (action.payload.error) state.items[action.payload.id].error = action.payload.error;
      }
    },
    removeDownload(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
  },
});

export const { addDownload, updateProgress, setStatus, removeDownload } = downloadsSlice.actions;
export default downloadsSlice.reducer;
