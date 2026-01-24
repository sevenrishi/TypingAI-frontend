import { useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export type SessionType = 'practice' | 'test' | 'battle';

interface SessionData {
  type: SessionType;
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  text: string;
  difficulty?: string;
  mode?: string;
  battleResult?: 'win' | 'loss' | 'draw';
  opponent?: string;
}

export function useSaveSession() {
  const auth = useSelector((s: RootState) => s.auth);

  const saveSession = useCallback(
    async (sessionData: SessionData) => {
      if (!auth.user) {
        console.warn('User not authenticated');
        return null;
      }

      try {
        const response = await axios.post('/api/sessions/create', sessionData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        return response.data;
      } catch (error) {
        console.error('Failed to save session:', error);
        return null;
      }
    },
    [auth.user]
  );

  return { saveSession };
}
