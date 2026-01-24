import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
  const { data } = await api.get('/users/me');
  return data;
});

export const updateAvatar = createAsyncThunk('user/updateAvatar', async (avatarId: string) => {
  const { data } = await api.put('/users/avatar', { avatarId });
  return data;
});

const slice = createSlice({
  name: 'profile',
  initialState: { user: null as any, bestWPM: 0, averageAccuracy: 0, history: [] as any[], status: 'idle' as string },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchProfile.pending, state => { state.status = 'loading'; })
      .addCase(fetchProfile.fulfilled, (state, action: any) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.bestWPM = action.payload.bestWPM;
        state.averageAccuracy = action.payload.averageAccuracy;
        state.history = action.payload.user?.history || [];
      })
      .addCase(fetchProfile.rejected, state => { state.status = 'failed'; })
      .addCase(updateAvatar.pending, state => { state.status = 'loading'; })
      .addCase(updateAvatar.fulfilled, (state, action: any) => {
        state.status = 'idle';
        state.user = action.payload.user;
      })
      .addCase(updateAvatar.rejected, state => { state.status = 'failed'; });
  }
});

export default slice.reducer;
