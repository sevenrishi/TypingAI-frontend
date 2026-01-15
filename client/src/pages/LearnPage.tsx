import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import LearningGuide from '../features/learn/components/LearningGuide';
import TypingTips from '../features/learn/components/TypingTips';
import ProgressTracker from '../features/learn/components/ProgressTracker';

export default function LearnPage() {
  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      <div className={`rounded-lg shadow-lg p-8 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/40 backdrop-blur-md'
          : 'bg-white border border-gray-300'
      }`}>
        <h2 className="text-3xl font-bold mb-4">Learn to Type Faster</h2>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Discover techniques and strategies to improve your typing speed and accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningGuide />
        <ProgressTracker />
      </div>

      <TypingTips />
    </div>
  );
}
