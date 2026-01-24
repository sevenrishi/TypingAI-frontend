import React, { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface TypingLoaderProps {
  isLoading: boolean;
  duration?: number;
}

export default function TypingLoader({ isLoading, duration = 3000 }: TypingLoaderProps) {
  const { theme } = useTheme();

  if (!isLoading) return null;

  const letters = ['T', 'y', 'p', 'i', 'n', 'g', 'A', 'I'];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
      isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
    } ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob ${
          theme === 'dark' ? 'bg-blue-900' : 'bg-blue-300'
        }`} />
        <div className={`absolute top-1/3 -right-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 ${
          theme === 'dark' ? 'bg-purple-900' : 'bg-purple-300'
        }`} />
        <div className={`absolute -bottom-1/2 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 ${
          theme === 'dark' ? 'bg-pink-900' : 'bg-pink-300'
        }`} />
      </div>

      {/* Main loader content */}
      <div className="relative text-center">
        {/* Animated circle background */}
        <div className={`mx-auto mb-8 w-32 h-32 rounded-full flex items-center justify-center relative ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/50'
            : 'bg-white/50 border border-gray-200/50'
        } backdrop-blur-md`}>
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" style={{ animationDuration: '2s' }} />
          
          {/* Animated keyboard icon */}
          <div className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
            ⌨️
          </div>
        </div>

        {/* Animated typing text */}
        <div className="h-12 flex items-center justify-center gap-1 mb-8">
          {letters.map((letter, idx) => (
            <span
              key={idx}
              className={`text-4xl font-black transition-all ${
                theme === 'dark'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
              }`}
              style={{
                animation: `typing-bounce 0.6s ease-in-out ${idx * 0.1}s infinite`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Loading text with animated dots */}
        <div className="text-lg font-semibold">
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            Loading
          </span>
          <span className={`inline-block w-6 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <span style={{ animation: 'blink 1.4s infinite' }}>.</span>
            <span style={{ animation: 'blink 1.4s infinite 0.2s' }}>.</span>
            <span style={{ animation: 'blink 1.4s infinite 0.4s' }}>.</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className={`mt-8 w-48 h-1 rounded-full overflow-hidden ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            style={{
              animation: `progress ${duration / 1000}s ease-in-out forwards`,
            }}
          />
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(5)].map((_, idx) => (
        <div
          key={idx}
          className={`absolute w-2 h-2 rounded-full ${
            theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
          } opacity-50`}
          style={{
            left: `${20 + idx * 15}%`,
            top: `${30 + idx * 10}%`,
            animation: `float-particle 4s ease-in-out ${idx * 0.3}s infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes typing-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes blink {
          0%, 49%, 100% { opacity: 0; }
          50%, 99% { opacity: 1; }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(30px); opacity: 0; }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
