import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider';
import { getStreakSnapshot } from '../utils/streaks';
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
  const isDark = theme === 'dark';
  const streakSnapshot = getStreakSnapshot();
  const streakLabel = `${streakSnapshot.currentStreak}d`;

  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100 backdrop-blur-md'
    : 'bg-white/60 border-slate-200/80 text-slate-900 backdrop-blur-md';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentText = isDark ? 'text-cyan-300' : 'text-sky-600';

  const StatChip = ({ label, value }: { label: string; value: string }) => (
    <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
      <div
        className="text-[11px] uppercase tracking-[0.28em] text-slate-400"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );

  const MiniStat = ({ label, value }: { label: string; value: string }) => (
    <div className={`rounded-xl border px-3 py-2 ${surfaceSoft}`}>
      <div
        className="text-[10px] uppercase tracking-[0.25em] text-slate-400"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );

  const ModeCard = ({
    title,
    description,
    href,
    icon,
    delayClass,
  }: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    delayClass?: string;
  }) => (
    <Link
      to={href}
      className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 animate-rise ${delayClass ?? ''} ${surface}`}
    >
      <div
        className={`absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${
          isDark ? 'bg-cyan-400/15' : 'bg-sky-200/60'
        }`}
      />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div
            className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {title}
          </div>
          <p className="mt-3 text-lg font-semibold">{description}</p>
        </div>
        <div
          className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
            isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <span className={accentText}>{icon}</span>
        </div>
      </div>
      <div className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accentText}`}>
        Launch mode
        <span className="text-base">→</span>
      </div>
    </Link>
  );

  return (
    <div className="space-y-24 max-md:space-y-16 pb-10">
      <section
        className={`relative overflow-hidden rounded-[32px] border p-6 sm:p-8 md:p-10 lg:p-14 ${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${isDark ? 'hero-grid-dark' : 'hero-grid-light'}`} />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6 animate-rise">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] ${
                isDark
                  ? 'border-cyan-500/40 text-cyan-200 bg-slate-900/60'
                  : 'border-sky-200 text-sky-700 bg-sky-50'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Typing Lab
            </div>
            <h1
              className="text-4xl md:text-6xl font-black leading-tight"
              style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
            >
              Type faster with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400">
                precision coaching
              </span>{' '}
              that adapts to you.
            </h1>
            <p className={`text-lg ${mutedText}`}>
              Build real speed with AI-generated drills, live accuracy feedback, and competitive sessions
              that keep your focus locked in.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/typing"
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)] hover:shadow-[0_22px_48px_rgba(34,211,238,0.45)]'
                    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] hover:shadow-[0_22px_48px_rgba(14,165,233,0.35)]'
                }`}
              >
                Start a test
                <Play className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/practice"
                className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                Build a practice plan
                <Target className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-rise animate-rise-delay-1">
              <StatChip label="Live WPM" value="92" />
              <StatChip label="Accuracy" value="98%" />
              <StatChip label="Streak" value={streakLabel} />
            </div>
          </div>

          <div className="relative animate-rise animate-rise-delay-2">
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-cyan-400/30 via-sky-400/20 to-emerald-400/30 blur-3xl" />
            <div className={`relative rounded-[28px] border p-6 ${surface}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span
                    className={`text-[11px] uppercase tracking-[0.3em] ${mutedText}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Live session
                  </span>
                </div>
                <span className={`text-xs uppercase tracking-[0.25em] ${accentText}`}>WPM 92</span>
              </div>
              <div className="mt-6 space-y-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <div className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  the quick brown fox jumps over the lazy dog
                </div>
                <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                  glide, strike, breathe, repeat.
                </div>
                <div className={`flex items-center gap-2 ${accentText}`}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                  accuracy 98%
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniStat label="Focus" value="Deep" />
                <MiniStat label="Drill" value="Precision" />
                <MiniStat label="Mode" value="Sprint" />
              </div>
            </div>
            {/*<div
              className={`absolute -bottom-10 -left-6 hidden md:block rounded-2xl border px-4 py-4 shadow-lg ${surfaceSoft}`}
            >
              <div
                className={`text-[11px] uppercase tracking-[0.25em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Today
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-bold">1,240</span>
                <span className={`text-sm ${mutedText}`}>words trained</span>
              </div>
            </div>*/}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <div
              className={`text-xs uppercase tracking-[0.35em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Why it works
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
            >
              A modern typing gym with real momentum.
            </h2>
          </div>
          <Link
            to="/learn"
            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              isDark
                ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
            }`}
          >
            Explore curriculum
            <BookOpen className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-6">
          <div className={`md:col-span-3 rounded-3xl border p-6 animate-rise ${surfaceSoft}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">AI-generated drills</h3>
                <p className={`mt-3 ${mutedText}`}>
                  Get sessions built from your weak spots, favorite topics, and real-time performance trends.
                </p>
              </div>
              <span className={accentText}>
                <Sparkles className="w-7 h-7" strokeWidth={1.6} />
              </span>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm font-semibold">
              <span className={accentText}>Dynamic prompts</span>
              <span className={mutedText}>Every 10 seconds</span>
            </div>
          </div>

          <div className={`md:col-span-3 rounded-3xl border p-6 animate-rise animate-rise-delay-1 ${surfaceSoft}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Precision analytics</h3>
                <p className={`mt-3 ${mutedText}`}>
                  See WPM, accuracy, and rhythm in one dashboard. Track plateaus and break them fast.
                </p>
              </div>
              <span className={accentText}>
                <BarChart3 className="w-7 h-7" strokeWidth={1.6} />
              </span>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm font-semibold">
              <span className={accentText}>Heatmaps</span>
              <span className={mutedText}>Key accuracy</span>
            </div>
          </div>

          <div className={`md:col-span-2 rounded-3xl border p-6 animate-rise animate-rise-delay-2 ${surfaceSoft}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Adaptive pacing</h3>
                <p className={`mt-3 ${mutedText}`}>Auto-adjusted difficulty so every run feels challenging.</p>
              </div>
              <span className={accentText}>
                <SlidersHorizontal className="w-6 h-6" strokeWidth={1.6} />
              </span>
            </div>
          </div>

          <div className={`md:col-span-2 rounded-3xl border p-6 animate-rise animate-rise-delay-2 ${surfaceSoft}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Multiplayer arenas</h3>
                <p className={`mt-3 ${mutedText}`}>Race live opponents and climb the global ladder.</p>
              </div>
              <span className={accentText}>
                <Users className="w-6 h-6" strokeWidth={1.6} />
              </span>
            </div>
          </div>

          <div className={`md:col-span-2 rounded-3xl border p-6 animate-rise animate-rise-delay-3 ${surfaceSoft}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Achievement loop</h3>
                <p className={`mt-3 ${mutedText}`}>Unlock streaks, badges, and milestones that keep you sharp.</p>
              </div>
              <span className={accentText}>
                <Trophy className="w-6 h-6" strokeWidth={1.6} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <div
              className={`text-xs uppercase tracking-[0.35em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Choose your run
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
            >
              Train, learn, and battle in one flow.
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <ModeCard
            title="Practice"
            description="Laser-focused drills for speed and accuracy gains."
            href="/practice"
            icon={<Target className="w-5 h-5" />}
            delayClass="animate-rise-delay-1"
          />
          <ModeCard
            title="Learn"
            description="Guided lessons that build muscle memory and rhythm."
            href="/learn"
            icon={<BookOpen className="w-5 h-5" />}
            delayClass="animate-rise-delay-2"
          />
          <ModeCard
            title="Battleground"
            description="Live multiplayer races with global leaderboards."
            href="/battleground"
            icon={<Swords className="w-5 h-5" />}
            delayClass="animate-rise-delay-3"
          />
        </div>
      </section>

      <section
        className={`relative overflow-hidden rounded-[28px] border p-6 sm:p-8 lg:p-10 text-center ${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -bottom-24 right-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Keyboard className={`w-4 h-4 ${accentText}`} />
              <span className={mutedText}>Instant feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className={`w-4 h-4 ${accentText}`} />
              <span className={mutedText}>Smart drills</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${accentText}`} />
              <span className={mutedText}>Progress tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${accentText}`} />
              <span className={mutedText}>Global competition</span>
            </div>
          </div>
          <h3
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
          >
            Ready to set a new personal best?
          </h3>
          <p className={`text-lg ${mutedText}`}>
            Jump in with a 60-second sprint or craft a training plan that fits your goals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/typing"
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)] hover:shadow-[0_22px_48px_rgba(34,211,238,0.45)]'
                  : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] hover:shadow-[0_22px_48px_rgba(14,165,233,0.35)]'
              }`}
            >
              Press start
              <Play className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/practice"
              className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              Build my plan
              <Target className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
