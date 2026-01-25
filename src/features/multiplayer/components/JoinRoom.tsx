import React, { useState } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface JoinRoomProps {
  playerName: string;
  isLoading: boolean;
  onJoin: (roomCode: string) => void;
  onBack: () => void;
}

export default function JoinRoom({ playerName, isLoading, onJoin, onBack }: JoinRoomProps) {
  const { theme } = useTheme();
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = () => {
    if (roomCode.trim()) {
      onJoin(roomCode.trim().toUpperCase());
    }
  };

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
          Join Room
        </h1>
        <p className={`text-center mb-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Playing as <span className="font-semibold">{playerName}</span>
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter room code"
            disabled={isLoading}
            maxLength={6}
            className={`w-full p-3 rounded-md border text-center text-lg font-semibold tracking-widest transition-colors duration-200 uppercase ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 disabled:opacity-50'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 disabled:opacity-50'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!roomCode.trim() || isLoading}
            className={`w-full py-3 rounded-md font-semibold transition-colors duration-200 ${
              !roomCode.trim() || isLoading
                ? theme === 'dark'
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Joining...' : 'Join'}
          </button>
        </div>

        <button
          onClick={onBack}
          disabled={isLoading}
          className={`w-full mt-6 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 ${
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
