import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import aiReducer from '../features/ai/aiSlice';
import typingReducer from '../features/typing/typingSlice';
import roomReducer from '../features/multiplayer/roomSlice';
import profileReducer from '../features/user/profileSlice';
import practiceReducer from '../features/practice/practiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ai: aiReducer,
    typing: typingReducer,
    room: roomReducer,
    profile: profileReducer,
    practice: practiceReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
