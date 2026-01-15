import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      <div className={`rounded-lg shadow-lg p-8 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/40 backdrop-blur-md'
          : 'bg-white border border-gray-300'
      }`}>
        <h2 className="text-3xl font-bold mb-4">Welcome to Typing AI</h2>
        <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Improve your typing speed and accuracy with AI-generated content on any topic you choose.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-bold mb-2">AI-Generated Topics</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Get custom typing exercises generated for any topic
            </p>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-bold mb-2">Real-time Statistics</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Track your WPM, accuracy, and improvement over time
            </p>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-bold mb-2">Competitive Racing</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Race against other players in real-time multiplayer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
