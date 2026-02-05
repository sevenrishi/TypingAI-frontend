import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Link } from 'react-router-dom';
import AnimatedTypingTitle from '../components/AnimatedTypingTitle';
import {
  BarChart3,
  BookOpen,
  Brain,
  Globe,
  Keyboard,
  Play,
  SlidersHorizontal,
  Sparkles,
  Swords,
  Target,
  Trophy,
  TrendingUp,
  Users,
} from 'lucide-react';

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
    <button
      type="button"
      className={`
        ${wide ? 'col-span-2' : ''} px-3 py-2 rounded-lg text-xs font-bold tracking-widest text-center border
        transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0
        ${theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-600 text-gray-200 shadow-[inset_0_-2px_0_rgba(0,0,0,0.6)] hover:border-cyan-300/70'
          : 'bg-gradient-to-b from-white to-slate-200 border-slate-300 text-slate-700 shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] hover:border-indigo-300'}
      `}
      aria-label={`Key ${label}`}
    >
      {label}
    </button>
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
              <Target className="w-7 h-7 mx-auto" strokeWidth={1.8} />
            )}
          />
          <KeyButton
            label="LEARN"
            href="/learn"
            icon={(
              <BookOpen className="w-7 h-7 mx-auto" strokeWidth={1.8} />
            )}
          />
          <KeyButton
            label="COMPETE"
            href="/battleground"
            icon={(
              <Swords className="w-7 h-7 mx-auto" strokeWidth={1.8} />
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
              <Sparkles className="w-10 h-10" strokeWidth={1.6} />
            )}
          />
          <FeatureKey 
            label="REAL-TIME STATS"
            description="Track your WPM, accuracy, and improvement over time with detailed analytics"
            icon={(
              <BarChart3 className="w-10 h-10" strokeWidth={1.6} />
            )}
          />
          <FeatureKey 
            label="MULTIPLAYER"
            description="Race against other players in real-time multiplayer typing battles"
            icon={(
              <Users className="w-10 h-10" strokeWidth={1.6} />
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
            { icon: <Brain className="w-7 h-7" strokeWidth={1.7} />, text: 'AI-powered personalized learning paths' },
            { icon: <SlidersHorizontal className="w-7 h-7" strokeWidth={1.7} />, text: 'Adaptive difficulty based on your skill level' },
            { icon: <Globe className="w-7 h-7" strokeWidth={1.7} />, text: 'Compete with players from around the world' },
            { icon: <TrendingUp className="w-7 h-7" strokeWidth={1.7} />, text: 'Detailed performance analytics and insights' },
            { icon: <Trophy className="w-7 h-7" strokeWidth={1.7} />, text: 'Gamified experience with achievements' },
            { icon: <Keyboard className="w-7 h-7" strokeWidth={1.7} />, text: 'Perfect your rhythm and muscle memory' }
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
            <Play className="w-5 h-5" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </div>
  );
}
