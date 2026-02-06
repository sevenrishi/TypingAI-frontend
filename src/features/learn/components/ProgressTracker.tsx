import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface MilestoneItem {
  wpm: number;
  accuracy: number;
  level: string;
  badge: string;
}

const milestones: MilestoneItem[] = [
  {
    wpm: 0,
    accuracy: 0,
    level: 'Beginner',
    badge: '🌱',
  },
  {
    wpm: 30,
    accuracy: 90,
    level: 'Novice',
    badge: '📚',
  },
  {
    wpm: 50,
    accuracy: 92,
    level: 'Intermediate',
    badge: '⭐',
  },
  {
    wpm: 80,
    accuracy: 95,
    level: 'Advanced',
    badge: '🚀',
  },
  {
    wpm: 120,
    accuracy: 97,
    level: 'Expert',
    badge: '🏆',
  },
];

export default function ProgressTracker() {
  const { theme } = useTheme();
  const [userStats] = React.useState({
    currentWpm: 45,
    currentAccuracy: 91,
  });

  const currentMilestoneIndex = milestones.findIndex(
    m => userStats.currentWpm >= m.wpm && userStats.currentAccuracy >= m.accuracy
  );
  const currentMilestone = milestones[Math.max(0, currentMilestoneIndex)];
  const nextMilestone = milestones[Math.min(currentMilestoneIndex + 1, milestones.length - 1)];

  return (
    <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-slate-900/70 border border-slate-700/60 backdrop-blur-xl'
        : 'bg-white/80 border border-slate-200'
    }`}>
      <h3 className="text-2xl font-bold mb-6">Your Progress</h3>

      {/* Current Stats */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90">Current WPM</p>
            <p className="text-3xl font-bold">{userStats.currentWpm}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Accuracy</p>
            <p className="text-3xl font-bold">{userStats.currentAccuracy}%</p>
          </div>
        </div>
      </div>

      {/* Current Level */}
      <div className="mb-6 text-center">
        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Current Level
        </p>
        <p className="text-4xl mb-2">{currentMilestone.badge}</p>
        <p className="text-xl font-bold text-sky-600 dark:text-cyan-300">
          {currentMilestone.level}
        </p>
      </div>

      {/* Progress to Next Level */}
      {currentMilestoneIndex < milestones.length - 1 && (
        <div>
          <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Progress to {nextMilestone.level}
          </p>
          <div className={`flex items-center justify-between mb-2 text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <span>{userStats.currentWpm} WPM</span>
            <span>{nextMilestone.wpm} WPM</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-300"
              style={{
                width: `${Math.min(
                  (userStats.currentWpm / nextMilestone.wpm) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}
      {currentMilestoneIndex === milestones.length - 1 && (
        <div className="text-center">
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            🎉 You've reached the highest level!
          </p>
        </div>
      )}
    </div>
  );
}
