import api from '../api/axios';

export type StreakSnapshot = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  todayActive: boolean;
  daysSinceActive: number | null;
};

const defaultSnapshot: StreakSnapshot = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  todayActive: false,
  daysSinceActive: null
};

const pad2 = (value: number) => String(value).padStart(2, '0');

export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
};

export const getStreakSnapshot = () => defaultSnapshot;

export const fetchStreakSnapshot = async (now = new Date()): Promise<StreakSnapshot> => {
  try {
    const dateKey = toDateKey(now);
    const { data } = await api.get('/users/progress', { params: { dateKey } });
    return data?.streak ?? defaultSnapshot;
  } catch (error) {
    return defaultSnapshot;
  }
};

export const recordStreakActivity = async (now = new Date()): Promise<StreakSnapshot | null> => {
  try {
    const dateKey = toDateKey(now);
    const { data } = await api.post('/users/streak/record', { dateKey });
    return data?.streak ?? null;
  } catch (error) {
    return null;
  }
};
