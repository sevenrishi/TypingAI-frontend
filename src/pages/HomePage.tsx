import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Link } from 'react-router-dom';
import AnimatedTypingTitle from '../components/AnimatedTypingTitle';

export default function HomePage() {
  const { theme } = useTheme();

  const KeyButton = ({ label, href, icon }: { label: string; href: string; icon: string }) => (
    <Link to={href} className={`relative group`}>
      <div className={`
        px-8 py-4 rounded-lg font-bold text-center transition-all duration-200
        ${theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-700 to-gray-800 border-2 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:border-cyan-300' 
          : 'bg-gradient-to-b from-indigo-600 to-indigo-700 border-2 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:border-indigo-300'}
        transform group-hover:-translate-y-1 active:translate-y-0
      `}>
        <div className="text-2xl mb-1">{icon}</div>
        <div className="text-sm">{label}</div>
        <div className={`
          absolute inset-0 rounded-lg transition-opacity opacity-0 group-hover:opacity-100
          ${theme === 'dark' ? 'bg-cyan-400/10' : 'bg-indigo-300/10'}
        `}></div>
      </div>
    </Link>
  );

  const FeatureKey = ({ label, description, icon }: { label: string; description: string; icon: string }) => (
    <div className={`
      relative p-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1
      ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-2 border-cyan-500/30 hover:border-cyan-400/70 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30'
        : 'bg-gradient-to-br from-indigo-600/30 to-indigo-700/30 border-2 border-indigo-400/40 hover:border-indigo-300/80 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40'}
    `}>
      <div className={`
        absolute top-2 right-2 w-3 h-3 rounded-full
        ${theme === 'dark' ? 'bg-cyan-400' : 'bg-indigo-300'}
      `}></div>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className={`font-bold mb-2 text-lg ${theme === 'dark' ? 'text-cyan-200' : 'text-indigo-100'}`}>
        {label}
      </h3>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-indigo-200'}`}>
        {description}
      </p>
    </div>
  );

  return (
    <div className="space-y-16">
      {/* Hero Section - Keyboard themed */}
      <div className={`
        rounded-2xl shadow-2xl p-12 transition-all duration-300 text-center
        ${theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800/60 via-gray-900/40 to-gray-800/60 border-2 border-cyan-500/40'
          : 'bg-gradient-to-b from-indigo-700/40 via-indigo-600/30 to-indigo-700/40 border-2 border-indigo-400/50'}
      `}>
        <div className="mb-6">
          <AnimatedTypingTitle />
        </div>
        <p className={`text-lg mb-10 tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-indigo-100'}`}>
          Master your keyboard. Dominate your speed. Compete globally.
        </p>
        
        {/* CTA Keyboard Keys */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <KeyButton label="START" href="/typing" icon="▶" />
          <KeyButton label="PRACTICE" href="/practice" icon="🎯" />
          <KeyButton label="RACE" href="/battleground" icon="🏁" />
          <KeyButton label="LEARN" href="/learn" icon="📚" />
          <KeyButton label="STATS" href="/profile" icon="📈" />
          <KeyButton label="COMPETE" href="/battleground" icon="⚔️" />
        </div>
      </div>

      {/* Features as Keyboard Keys */}
      <div>
        <h2 className={`text-4xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-cyan-300' : 'text-indigo-200'}`}>
          FEATURES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureKey 
            label="AI GENERATED"
            description="Get custom typing exercises generated for any topic you want to master"
            icon="⚡"
          />
          <FeatureKey 
            label="REAL-TIME STATS"
            description="Track your WPM, accuracy, and improvement over time with detailed analytics"
            icon="📊"
          />
          <FeatureKey 
            label="MULTIPLAYER"
            description="Race against other players in real-time multiplayer typing battles"
            icon="🏁"
          />
        </div>
      </div>

      {/* Stats Section - Key Press style */}
      <div className={`
        rounded-2xl shadow-xl p-10 transition-all duration-300
        ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-cyan-500/30'
          : 'bg-gradient-to-br from-indigo-700/40 to-indigo-600/40 border-2 border-indigo-400/30'}
      `}>
        <h3 className={`text-3xl font-bold mb-8 tracking-wider ${theme === 'dark' ? 'text-cyan-300' : 'text-indigo-100'}`}>
          WHY TYPING AI?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '✨', text: 'AI-powered personalized learning paths' },
            { icon: '🎯', text: 'Adaptive difficulty based on your skill level' },
            { icon: '🌍', text: 'Compete with players from around the world' },
            { icon: '📈', text: 'Detailed performance analytics and insights' },
            { icon: '🎮', text: 'Gamified experience with achievements' },
            { icon: '⌨️', text: 'Perfect your rhythm and muscle memory' }
          ].map((item, idx) => (
            <div key={idx} className={`
              flex items-center gap-4 p-4 rounded-lg transition-all duration-300
              ${theme === 'dark'
                ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-cyan-400/30'
                : 'bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-300/40'}
            `}>
              <span className="text-3xl">{item.icon}</span>
              <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-indigo-100'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className={`text-lg font-semibold tracking-wide ${theme === 'dark' ? 'text-cyan-300' : 'text-indigo-200'}`}>
          Ready to level up your typing game?
        </p>
        <Link to="/typing" className={`
          inline-block mt-6 px-12 py-4 rounded-lg font-bold text-lg tracking-widest
          transition-all duration-300 transform hover:-translate-y-1
          ${theme === 'dark'
            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-gray-900 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70'
            : 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70'}
        `}>
          PRESS START ▶
        </Link>
      </div>
    </div>
  );
}
