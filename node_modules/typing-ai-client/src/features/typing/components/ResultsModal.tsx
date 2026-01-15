import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

export default function ResultsModal({ visible, onClose, stats, onSave }:
  { visible: boolean; onClose: () => void; stats: { wpm: number; cpm: number; accuracy: number; errors: number; elapsed: number }; onSave?: () => void }) {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-black/40'
        : 'bg-black/20'
    }`}>
      <div className={`p-6 rounded w-96 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800'
          : 'bg-white'
      } shadow-2xl`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Test Results</h3>
        <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          <div>WPM: <strong>{Math.round(stats.wpm)}</strong></div>
          <div>CPM: <strong>{Math.round(stats.cpm)}</strong></div>
          <div>Accuracy: <strong>{Math.round(stats.accuracy)}%</strong></div>
          <div>Errors: <strong>{stats.errors}</strong></div>
          <div>Time: <strong>{Math.ceil(stats.elapsed / 1000)}s</strong></div>
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onClose}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
            }`}
          >
            Close
          </button>
          <button
            onClick={onSave}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Save Result
          </button>
        </div>
      </div>
    </div>
  );
}
