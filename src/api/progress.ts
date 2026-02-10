import api from './axios';
import type { CertificateData } from '../utils/certificates';
import type { StreakSnapshot } from '../utils/streaks';

export type LearningProgress = {
  completedLessons: number[];
  certificate: CertificateData | null;
  updatedAt?: string | null;
};

export type UserProgress = {
  streak: StreakSnapshot;
  learning: LearningProgress;
};

export async function fetchUserProgress(dateKey?: string): Promise<UserProgress> {
  const params = dateKey ? { dateKey } : undefined;
  const { data } = await api.get('/users/progress', { params });
  return data as UserProgress;
}

export async function updateLearningProgress(payload: {
  completedLessons?: number[];
  certificate?: CertificateData | null;
}) {
  const { data } = await api.put('/users/learning', payload);
  return data as { learning: LearningProgress };
}
