import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface RoomSelectionProps {
  playerName: string;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onBack: () => void;
}

export default function RoomSelection({ playerName, onCreateRoom, onJoinRoom, onBack }: RoomSelectionProps) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md rounded-lg shadow-lg p-8 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-700'
          : 'bg-gradient-to-b from-white to-gray-50 border border-gray-300'
      }`}>
        <h1 className={`text-3xl font-bold mb-2 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Typing Battleground
        </h1>
        <p className={`text-center mb-1 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Playing as
        </p>
        <p className={`text-center mb-8 text-lg font-semibold ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`}>
          {playerName}
        </p>

        <div className="space-y-4">
          <button
            onClick={onCreateRoom}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 border-2 ${
              theme === 'dark'
                ? 'bg-green-600 hover:bg-green-700 border-green-500 text-white'
                : 'bg-green-600 hover:bg-green-700 border-green-600 text-white'
            }`}
          >
            + Create Room
          </button>

          <button
            onClick={onJoinRoom}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 border-2 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 border-blue-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white'
            }`}
          >
            Join Room
          </button>
        </div>

        <button
          onClick={onBack}
          className={`w-full mt-6 py-2 rounded-md font-medium transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Back
        </button>
      </div>
    </div>
  );
}
