import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  defaultDownloadPath: string;
  fontSize: number;
  keepScreenOn: boolean;
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: 'system',
    defaultDownloadPath: 'textbooks/',
    fontSize: 16,
    keepScreenOn: true,
  } as SettingsState,
  reducers: {
    setSetting<K extends keyof SettingsState>(
      state: SettingsState,
      action: PayloadAction<{ key: K; value: SettingsState[K] }>,
    ) {
      (state[action.payload.key] as SettingsState[K]) = action.payload.value;
    },
  },
});

export const { setSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
