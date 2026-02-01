import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const generateMultiplayerText = createAsyncThunk(
  'aiMultiplayer/generateText',
  async (payload: { topic: string; length: 'short' | 'medium' | 'long'; difficulty?: string }) => {
    const { data } = await api.post('/ai/generate', payload);
    return data.text as string;
  }
);

const slice = createSlice({
  name: 'aiMultiplayer',
  initialState: { text: '', status: 'idle' as string, error: null as string | null },
  reducers: {
    clear(state) { state.text = ''; state.status = 'idle'; state.error = null; }
  },
  extraReducers(builder) {
    builder
      .addCase(generateMultiplayerText.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(generateMultiplayerText.fulfilled, (state, action) => { state.status = 'succeeded'; state.text = action.payload; })
      .addCase(generateMultiplayerText.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message || 'Failed'; });
  }
});

export const { clear } = slice.actions;
export default slice.reducer;
