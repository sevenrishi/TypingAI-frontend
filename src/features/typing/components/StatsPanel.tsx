import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

export default function StatsPanel({ wpm, cpm, accuracy, errors, elapsed }: { wpm: number; cpm: number; accuracy: number; errors: number; elapsed: number }) {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-5 gap-3 mt-4 text-sm">
      <div className={`p-3 rounded-md text-center shadow-inner transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-700/40 text-gray-100'
          : 'bg-gray-200/40 text-gray-900'
      }`}>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>WPM</div>
        <div className="text-xl font-bold">{Math.round(wpm)}</div>
      </div>
      <div className={`p-3 rounded-md text-center shadow-inner transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-700/40 text-gray-100'
          : 'bg-gray-200/40 text-gray-900'
      }`}>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>CPM</div>
        <div className="text-xl font-bold">{Math.round(cpm)}</div>
      </div>
      <div className={`p-3 rounded-md text-center shadow-inner transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-700/40 text-gray-100'
          : 'bg-gray-200/40 text-gray-900'
      }`}>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Accuracy</div>
        <div className="text-xl font-bold">{Math.round(accuracy)}%</div>
      </div>
      <div className={`p-3 rounded-md text-center shadow-inner transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-700/40 text-gray-100'
          : 'bg-gray-200/40 text-gray-900'
      }`}>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Errors</div>
        <div className="text-xl font-bold">{errors}</div>
      </div>
      <div className={`p-3 rounded-md text-center shadow-inner transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-700/40 text-gray-100'
          : 'bg-gray-200/40 text-gray-900'
      }`}>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Time</div>
        <div className="text-xl font-bold">{Math.ceil(elapsed/1000)}s</div>
      </div>
    </div>
  );
}
