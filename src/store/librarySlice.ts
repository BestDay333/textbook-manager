import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Textbook } from '../types';

interface LibraryState {
  textbooks: Record<string, Textbook>;
  recentIds: string[];
}

const initialState: LibraryState = { textbooks: {}, recentIds: [] };

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addTextbook(state, action: PayloadAction<Textbook>) {
      state.textbooks[action.payload.id] = action.payload;
    },
    removeTextbook(state, action: PayloadAction<string>) {
      delete state.textbooks[action.payload];
      state.recentIds = state.recentIds.filter((id) => id !== action.payload);
    },
    updateTextbook(state, action: PayloadAction<Partial<Textbook> & { id: string }>) {
      const book = state.textbooks[action.payload.id];
      if (book) Object.assign(book, action.payload);
    },
    markOpened(state, action: PayloadAction<string>) {
      const book = state.textbooks[action.payload];
      if (book) book.lastOpenedAt = new Date().toISOString();
      state.recentIds = [
        action.payload,
        ...state.recentIds.filter((id) => id !== action.payload),
      ].slice(0, 20);
    },
  },
});

export const { addTextbook, removeTextbook, updateTextbook, markOpened } = librarySlice.actions;
export default librarySlice.reducer;
