import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

type TypingState = {
  text: string;
  typed: string;
  status: 'idle' | 'running' | 'finished';
  errors: number;
  startTime?: number | null;
  elapsed: number; // ms
};

const initialState: TypingState = { text: '', typed: '', status: 'idle', errors: 0, startTime: null, elapsed: 0 };

const slice = createSlice({
  name: 'typing',
  initialState,
  reducers: {
    loadText(state, action: PayloadAction<string>) {
      state.text = action.payload;
      state.typed = '';
      state.status = 'idle';
      state.errors = 0;
      state.startTime = null;
      state.elapsed = 0;
    },
    startIfNeeded(state) {
      if (!state.startTime) state.startTime = Date.now();
      state.status = 'running';
    },
    updateTyped(state, action: PayloadAction<string>) {
      state.typed = action.payload;
      // update errors by comparing characters
      let e = 0;
      for (let i = 0; i < state.typed.length; i++) {
        if (state.typed[i] !== state.text[i]) e++;
      }
      state.errors = e;
      if (state.typed === state.text) {
        state.status = 'finished';
        state.elapsed = state.startTime ? Date.now() - state.startTime : 0;
      }
    },
    tick(state) {
      if (state.startTime && state.status === 'running') state.elapsed = Date.now() - state.startTime;
    },
    reset(state) {
      Object.assign(state, initialState);
    }
  }
});

export const { loadText, startIfNeeded, updateTyped, tick, reset } = slice.actions;
export default slice.reducer;

export const saveResult = createAsyncThunk('typing/saveResult', async (payload: { wpm: number; cpm: number; accuracy: number; errors: number; duration: number; text: string; room?: string }) => {
  const { data } = await api.post('/results', payload);
  return data;
});
