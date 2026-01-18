import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const generateText = createAsyncThunk(
  'ai/generateText',
  async (payload: { topic: string; length: 'short' | 'medium' | 'long'; difficulty?: string }) => {
    const { data } = await api.post('/ai/generate', payload);
    return data.text as string;
  }
);

const slice = createSlice({
  name: 'ai',
  initialState: { text: '', status: 'idle' as string, error: null as string | null },
  reducers: {
    clear(state) { state.text = ''; state.status = 'idle'; state.error = null; }
  },
  extraReducers(builder) {
    builder
      .addCase(generateText.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(generateText.fulfilled, (state, action) => { state.status = 'succeeded'; state.text = action.payload; })
      .addCase(generateText.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message || 'Failed'; });
  }
});

export const { clear } = slice.actions;
export default slice.reducer;
