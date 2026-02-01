import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Link } from 'react-router-dom';
import AnimatedTypingTitle from '../components/AnimatedTypingTitle';

export default function HomePage() {
  const { theme } = useTheme();

  const iconClass = theme === 'dark' ? 'text-cyan-300' : 'text-indigo-500';

  const KeyButton = ({ label, href, icon }: { label: string; href: string; icon: React.ReactNode }) => (
    <Link to={href} className={`relative group`}>
      <div className={`
        px-8 py-5 rounded-2xl font-bold text-center transition-all duration-200 border
        ${theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-700 to-gray-900 border-gray-600 text-cyan-200 shadow-[inset_0_-2px_0_rgba(0,0,0,0.6),0_10px_25px_rgba(0,0,0,0.35)] hover:border-cyan-300/70 hover:shadow-cyan-500/25' 
          : 'bg-gradient-to-b from-white to-slate-200 border-slate-300 text-indigo-700 shadow-[inset_0_-2px_0_rgba(0,0,0,0.12),0_10px_25px_rgba(99,102,241,0.15)] hover:border-indigo-300'}
        transform group-hover:-translate-y-1 active:translate-y-0 active:shadow-inner
      `}>
        <div className={`mb-1 ${iconClass}`}>{icon}</div>
        <div className="text-sm">{label}</div>
        <div className={`
          absolute inset-0 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100
          ${theme === 'dark' ? 'bg-cyan-400/10' : 'bg-indigo-500/5'}
        `}></div>
        <div className={`absolute left-3 right-3 bottom-2 h-1.5 rounded-full ${
          theme === 'dark' ? 'bg-gray-950/70' : 'bg-slate-300/80'
        }`}></div>
      </div>
    </Link>
  );

  const KeyCap = ({ label, wide }: { label: string; wide?: boolean }) => (
    <div className={`
      ${wide ? 'col-span-2' : ''} px-3 py-2 rounded-lg text-xs font-bold tracking-widest text-center border
      ${theme === 'dark'
        ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-600 text-gray-200 shadow-[inset_0_-2px_0_rgba(0,0,0,0.6)]'
        : 'bg-gradient-to-b from-white to-slate-200 border-slate-300 text-slate-700 shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]'}
    `}>
      {label}
    </div>
  );

  const FeatureKey = ({ label, description, icon }: { label: string; description: string; icon: React.ReactNode }) => (
    <div className={`
      relative p-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1
      ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-2 border-cyan-500/30 hover:border-cyan-400/70 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30'
        : 'bg-white/80 border border-slate-200 hover:border-indigo-300/70 shadow-md shadow-slate-200/50 hover:shadow-indigo-200/50'}
    `}>
      <div className={`
        absolute top-2 right-2 w-3 h-3 rounded-full
        ${theme === 'dark' ? 'bg-cyan-400' : 'bg-indigo-400'}
      `}></div>
      <div className={`mb-3 ${iconClass}`}>{icon}</div>
      <h3 className={`font-bold mb-2 text-lg ${theme === 'dark' ? 'text-cyan-200' : 'text-slate-800'}`}>
        {label}
      </h3>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
        {description}
      </p>
    </div>
  );

  return (
    <div className="space-y-16">
      {/* Hero Section - Keyboard themed */}
      <div className={`
        relative overflow-hidden rounded-3xl shadow-2xl p-12 transition-all duration-300 text-center mt-12
        ${theme === 'dark'
          ? 'bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 border-2 border-cyan-500/40'
          : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200'}
      `}>
        <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'opacity-20' : 'opacity-10'}`}>
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/30 blur-3xl" />
        </div>
        <div className="mb-6">
          <AnimatedTypingTitle />
        </div>
        <p className={`text-lg mb-10 tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
          Master your keyboard. Dominate your speed. Compete globally.
        </p>
        
        {/* CTA Keyboard Keys */}
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          <KeyButton
            label="PRACTICE"
            href="/practice"
            icon={(
              <svg className="w-7 h-7 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            )}
          />
          <KeyButton
            label="LEARN"
            href="/learn"
            icon={(
              <svg className="w-7 h-7 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6.5c0-1 1-1.5 2-1.5h11c1 0 2 .5 2 1.5v11c0 1-1 1.5-2 1.5H6c-1 0-2-.5-2-1.5z" />
                <path d="M8 5v14" />
                <path d="M12 8h5M12 12h5M12 16h4" />
              </svg>
            )}
          />
          <KeyButton
            label="COMPETE"
            href="/battleground"
            icon={(
              <svg className="w-7 h-7 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 4h6v6H6z" />
                <path d="M12 10h6v6h-6z" />
                <path d="M6 16h6v4H6z" />
                <path d="M9 7l2 2" />
                <path d="M15 13l2 2" />
              </svg>
            )}
          />
        </div>

        {/* Decorative keyboard row */}
        <div className="mt-10 grid grid-cols-12 gap-2 max-w-5xl mx-auto">
          <KeyCap label="Q" />
          <KeyCap label="W" />
          <KeyCap label="E" />
          <KeyCap label="R" />
          <KeyCap label="T" />
          <KeyCap label="Y" />
          <KeyCap label="U" />
          <KeyCap label="I" />
          <KeyCap label="O" />
          <KeyCap label="P" />
          <KeyCap label="[" />
          <KeyCap label="]" />
          <KeyCap label="A" />
          <KeyCap label="S" />
          <KeyCap label="D" />
          <KeyCap label="F" />
          <KeyCap label="G" />
          <KeyCap label="H" />
          <KeyCap label="J" />
          <KeyCap label="K" />
          <KeyCap label="L" />
          <KeyCap label=";" />
          <KeyCap label="ENTER" wide />
          <KeyCap label="SPACE" wide />
          <KeyCap label="SHIFT" wide />
        </div>
      </div>

      {/* Features as Keyboard Keys */}
      <div>
        <h2 className={`text-4xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-cyan-300' : 'text-indigo-600'}`}>
          FEATURES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureKey 
            label="AI GENERATED"
            description="Get custom typing exercises generated for any topic you want to master"
            icon={(
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="7" y="7" width="10" height="10" rx="2" />
                <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          />
          <FeatureKey 
            label="REAL-TIME STATS"
            description="Track your WPM, accuracy, and improvement over time with detailed analytics"
            icon={(
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 19V5" />
                <path d="M8 19V9" />
                <path d="M12 19V12" />
                <path d="M16 19V7" />
                <path d="M20 19V4" />
              </svg>
            )}
          />
          <FeatureKey 
            label="MULTIPLAYER"
            description="Race against other players in real-time multiplayer typing battles"
            icon={(
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="8" cy="10" r="3" />
                <circle cx="16" cy="10" r="3" />
                <path d="M3 20c0-3 3-5 5-5" />
                <path d="M21 20c0-3-3-5-5-5" />
                <path d="M10.5 20c.5-2 2.5-3.5 5-3.5" />
              </svg>
            )}
          />
        </div>
      </div>

      {/* Stats Section - Key Press style */}
      <div className={`
        rounded-3xl shadow-xl p-10 transition-all duration-300
        ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900/70 to-gray-950/60 border-2 border-cyan-500/30'
          : 'bg-white/90 border border-slate-200'}
      `}>
        <h3 className={`text-3xl font-bold mb-8 tracking-wider ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-800'}`}>
          WHY TYPING AI?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.8 7.1 18.2 8 12.7 4 8.8 9.5 8z" />
              </svg>
            ), text: 'AI-powered personalized learning paths' },
            { icon: (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="7" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            ), text: 'Adaptive difficulty based on your skill level' },
            { icon: (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a14 14 0 010 18" />
                <path d="M12 3a14 14 0 000 18" />
              </svg>
            ), text: 'Compete with players from around the world' },
            { icon: (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M4 16l6-6 4 4 6-7" />
                <path d="M20 7v5h-5" />
              </svg>
            ), text: 'Detailed performance analytics and insights' },
            { icon: (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 7h12" />
                <path d="M7 7l2 10h6l2-10" />
                <path d="M9 17v3M15 17v3" />
              </svg>
            ), text: 'Gamified experience with achievements' },
            { icon: (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M7 10h2M11 10h2M15 10h2M7 14h10" />
              </svg>
            ), text: 'Perfect your rhythm and muscle memory' }
          ].map((item, idx) => (
            <div key={idx} className={`
              flex items-center gap-4 p-4 rounded-lg transition-all duration-300
              ${theme === 'dark'
                ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-cyan-400/30'
                : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'}
            `}>
              <span className={`${iconClass}`}>{item.icon}</span>
              <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className={`text-lg font-semibold tracking-wide ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'}`}>
          Ready to level up your typing game?
        </p>
        <Link to="/typing" className={`
          inline-block mt-6 px-12 py-4 rounded-lg font-bold text-lg tracking-widest
          transition-all duration-300 transform hover:-translate-y-1
          ${theme === 'dark'
            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-gray-900 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70'
            : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-300/60 hover:shadow-indigo-400/70'}
        `}>
          <span className="inline-flex items-center gap-3 text-white">
            PRESS START
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
