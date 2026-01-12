import React from 'react';

export default function ResultsModal({ visible, onClose, stats, onSave }:
  { visible: boolean; onClose: () => void; stats: { wpm: number; cpm: number; accuracy: number; errors: number; elapsed: number }; onSave?: () => void }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded w-96">
        <h3 className="text-lg font-semibold mb-3">Test Results</h3>
        <div className="space-y-2">
          <div>WPM: <strong>{Math.round(stats.wpm)}</strong></div>
          <div>CPM: <strong>{Math.round(stats.cpm)}</strong></div>
          <div>Accuracy: <strong>{Math.round(stats.accuracy)}%</strong></div>
          <div>Errors: <strong>{stats.errors}</strong></div>
          <div>Time: <strong>{Math.ceil(stats.elapsed / 1000)}s</strong></div>
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Close</button>
          <button onClick={onSave} className="px-3 py-1 rounded bg-blue-600 text-white">Save Result</button>
        </div>
      </div>
    </div>
  );
}
