import React, { useState } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface NameEntryProps {
  onNext: (name: string) => void;
}

export default function NameEntry({ onNext }: NameEntryProps) {
  const { theme } = useTheme();
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className={`min-h-[81vh] flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md rounded-lg shadow-lg p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-700'
          : 'bg-gradient-to-b from-white to-gray-50 border border-gray-300'
      }`}>
        <h1 className={`text-3xl font-bold mb-2 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Typing Battleground
        </h1>
        <p className={`text-center mb-6 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Enter your name to get started
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Your display name"
            autoFocus
            maxLength={20}
            className={`w-full p-3 rounded-md border text-center text-lg transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={`w-full py-3 rounded-md font-semibold transition-colors duration-200 ${
              !name.trim()
                ? theme === 'dark'
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
