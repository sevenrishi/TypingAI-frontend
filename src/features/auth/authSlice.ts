import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

type User = { id: string; displayName?: string; email?: string } | null;

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    if (data?.token) localStorage.setItem('token', data.token);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { error: 'Email or password is wrong' });
  }
});

export const register = createAsyncThunk('auth/register', async (payload: { email?: string; password: string; displayName?: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { error: 'Registration failed' });
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  const { data } = await api.get('/users/me');
  return data.user;
});

const initialState = { user: null as User, status: 'idle' as string, token: (localStorage.getItem('token') || null), isAuthChecked: false };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setAuthChecked(state, action) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, state => { state.status = 'loading'; })
      .addCase(login.fulfilled, (state, action: any) => { state.status = 'idle'; state.user = action.payload.user; state.token = action.payload.token; state.isAuthChecked = true; })
      .addCase(register.pending, state => { state.status = 'loading'; })
      .addCase(register.fulfilled, state => { state.status = 'idle'; })
      .addCase(register.rejected, state => { state.status = 'idle'; })
      .addCase(loadUser.pending, state => { state.status = 'loading'; })
      .addCase(loadUser.fulfilled, (state, action: any) => { state.user = action.payload; state.status = 'idle'; state.isAuthChecked = true; })
      .addCase(loadUser.rejected, state => { state.status = 'idle'; state.isAuthChecked = true; });
  }
});

export const { logout, setAuthChecked } = slice.actions;
export default slice.reducer;
