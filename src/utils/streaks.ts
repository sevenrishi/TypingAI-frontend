export type StreakSnapshot = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  todayActive: boolean;
  daysSinceActive: number | null;
};

type StreakStorage = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  updatedAt?: string;
};

const STORAGE_KEY = 'typingai.streak.v1';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const pad2 = (value: number) => String(value).padStart(2, '0');

export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
};

const dateKeyToUtcDayNumber = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return null;
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
};

const diffDays = (fromKey: string, toKey: string) => {
  const fromDay = dateKeyToUtcDayNumber(fromKey);
  const toDay = dateKeyToUtcDayNumber(toKey);
  if (fromDay == null || toDay == null) return null;
  return toDay - fromDay;
};

const readStreak = (): StreakStorage | null => {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StreakStorage;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      currentStreak: Number(parsed.currentStreak || 0),
      longestStreak: Number(parsed.longestStreak || 0),
      lastActiveDate: parsed.lastActiveDate || null,
      updatedAt: parsed.updatedAt
    };
  } catch {
    return null;
  }
};

const writeStreak = (data: StreakStorage) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage failures
  }
};

export const getStreakSnapshot = (now = new Date()): StreakSnapshot => {
  const stored = readStreak();
  if (!stored) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      todayActive: false,
      daysSinceActive: null
    };
  }

  const todayKey = toDateKey(now);
  const lastKey = stored.lastActiveDate;
  if (!lastKey) {
    return {
      currentStreak: 0,
      longestStreak: stored.longestStreak || 0,
      lastActiveDate: null,
      todayActive: false,
      daysSinceActive: null
    };
  }

  const dayDiff = diffDays(lastKey, todayKey);
  const normalizedDiff = dayDiff == null ? null : Math.max(0, dayDiff);
  const todayActive = normalizedDiff === 0;
  const currentStreak = normalizedDiff != null && normalizedDiff <= 1 ? stored.currentStreak || 0 : 0;

  return {
    currentStreak,
    longestStreak: stored.longestStreak || 0,
    lastActiveDate: lastKey,
    todayActive,
    daysSinceActive: normalizedDiff
  };
};

export const recordStreakActivity = (now = new Date()): StreakSnapshot => {
  const todayKey = toDateKey(now);
  const stored = readStreak();

  if (!stored) {
    const fresh: StreakStorage = {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: todayKey,
      updatedAt: now.toISOString()
    };
    writeStreak(fresh);
    return getStreakSnapshot(now);
  }

  const lastKey = stored.lastActiveDate;
  if (lastKey === todayKey) {
    return getStreakSnapshot(now);
  }

  const dayDiff = lastKey ? diffDays(lastKey, todayKey) : null;
  let nextCurrent = stored.currentStreak || 0;

  if (dayDiff == null || dayDiff > 1) {
    nextCurrent = 1;
  } else if (dayDiff === 1) {
    nextCurrent = Math.max(1, nextCurrent + 1);
  } else if (dayDiff <= 0) {
    nextCurrent = Math.max(1, nextCurrent);
  }

  const nextLongest = Math.max(stored.longestStreak || 0, nextCurrent);
  const next: StreakStorage = {
    currentStreak: nextCurrent,
    longestStreak: nextLongest,
    lastActiveDate: todayKey,
    updatedAt: now.toISOString()
  };

  writeStreak(next);
  return getStreakSnapshot(now);
};
