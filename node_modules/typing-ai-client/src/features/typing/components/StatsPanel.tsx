import React from 'react';

export default function StatsPanel({ wpm, cpm, accuracy, errors, elapsed }: { wpm: number; cpm: number; accuracy: number; errors: number; elapsed: number }) {
  return (
    <div className="grid grid-cols-5 gap-3 mt-4 text-sm">
      <div className="p-3 bg-gray-700/40 rounded-md text-center shadow-inner">
        <div className="text-xs text-gray-300">WPM</div>
        <div className="text-xl font-bold">{Math.round(wpm)}</div>
      </div>
      <div className="p-3 bg-gray-700/40 rounded-md text-center shadow-inner">
        <div className="text-xs text-gray-300">CPM</div>
        <div className="text-xl font-bold">{Math.round(cpm)}</div>
      </div>
      <div className="p-3 bg-gray-700/40 rounded-md text-center shadow-inner">
        <div className="text-xs text-gray-300">Accuracy</div>
        <div className="text-xl font-bold">{Math.round(accuracy)}%</div>
      </div>
      <div className="p-3 bg-gray-700/40 rounded-md text-center shadow-inner">
        <div className="text-xs text-gray-300">Errors</div>
        <div className="text-xl font-bold">{errors}</div>
      </div>
      <div className="p-3 bg-gray-700/40 rounded-md text-center shadow-inner">
        <div className="text-xs text-gray-300">Time</div>
        <div className="text-xl font-bold">{Math.ceil(elapsed/1000)}s</div>
      </div>
    </div>
  );
}
