import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../providers/ThemeProvider';
import { Bell, Palette, ShieldCheck, User } from 'lucide-react';
import api from '../api/axios';

export default function AccountSettingsPage() {
  const { theme } = useTheme();
  const auth = useSelector((s: RootState) => s.auth);
  const profile = useSelector((s: RootState) => s.profile);
  const isDark = theme === 'dark';
  const [sessionStats, setSessionStats] = useState<any>(null);

  const displayName = profile.user?.displayName || auth.user?.displayName || 'Member';
  const email = profile.user?.email || auth.user?.email || 'Not provided';
  const totalTests = Array.isArray(profile.history) ? profile.history.length : 0;
  const testsCount = sessionStats?.stats?.tests?.count ?? totalTests;
  const practiceCount = sessionStats?.stats?.practice?.count ?? 0;
  const battlesCount = sessionStats?.stats?.battles?.count ?? 0;
  const totalSessions = sessionStats?.stats ? testsCount + practiceCount + battlesCount : totalTests;
  const bestWpmValue = sessionStats?.user?.bestWPM ?? profile.bestWPM;
  const avgAccuracyValue = sessionStats?.user?.averageAccuracy ?? profile.averageAccuracy;
  const statsAvailable = totalSessions > 0;
  const bestWpmLabel = statsAvailable ? String(Math.round(bestWpmValue || 0)) : 'NA';
  const accuracyLabel = statsAvailable ? `${Math.round(avgAccuracyValue || 0)}%` : 'NA';

  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/50 border-slate-700/50 text-slate-100 backdrop-blur-md'
    : 'bg-white/60 border-slate-200 text-slate-900 backdrop-blur-md';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentText = isDark ? 'text-cyan-300' : 'text-sky-600';

  useEffect(() => {
    if (!profile.user?._id) return;
    let active = true;
    api.get(`/sessions/stats/${profile.user._id}`)
      .then((response) => {
        if (active) setSessionStats(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch session stats', error);
      });
    return () => {
      active = false;
    };
  }, [profile.user?._id]);

  return (
    <div className="space-y-10 pb-10">
      <section
        className={`relative overflow-hidden rounded-[32px] border p-8 md:p-10 ${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${isDark ? 'hero-grid-dark' : 'hero-grid-light'}`} />
          <div className="absolute -top-16 -right-16 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>
        <div className="relative z-10 space-y-4">
          <div
            className={`text-xs uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Account workspace
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
          >
            Account settings
          </h1>
          <p className={`text-lg ${mutedText}`}>
            Review your profile info, manage security, and tune how TypingAI supports your sessions.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className={`rounded-full border px-4 py-2 ${surfaceSoft}`}>
              Member: <span className="font-semibold">{displayName}</span>
            </div>
            <div className={`rounded-full border px-4 py-2 ${surfaceSoft}`}>
              Total sessions: <span className="font-semibold">{totalSessions}</span>
            </div>
            <div className={`rounded-full border px-4 py-2 ${surfaceSoft}`}>
              Best WPM: <span className="font-semibold">{bestWpmLabel}</span>
            </div>
            <div className={`rounded-full border px-4 py-2 ${surfaceSoft}`}>
              Accuracy: <span className="font-semibold">{accuracyLabel}</span>
            </div>
            <div className={`rounded-full border px-4 py-2 ${surfaceSoft}`}>
              Tests: <span className="font-semibold">{testsCount}</span>
            </div>
            <div className={`rounded-full border px-4 py-2 ${surfaceSoft}`}>
              Practice: <span className="font-semibold">{practiceCount}</span>
            </div>
            <div className={`rounded-full border px-4 py-2 ${surfaceSoft}`}>
              Battles: <span className="font-semibold">{battlesCount}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className={`rounded-3xl border p-6 ${surface}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className={accentText}>
                  <User className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-semibold">Profile details</h2>
              </div>
              <p className={`mt-2 ${mutedText}`}>
                Keep your name and contact info up to date.
              </p>
            </div>
            <Link
              to="/profile"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              Open profile
            </Link>
          </div>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className={mutedText}>Display name</span>
              <span className="font-semibold">{displayName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={mutedText}>Email</span>
              <span className="font-semibold">{email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={mutedText}>Plan</span>
              <span className="font-semibold">Standard</span>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border p-6 ${surface}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className={accentText}>
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-semibold">Security</h2>
              </div>
              <p className={`mt-2 ${mutedText}`}>
                Control password protection and login safety.
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-500'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Coming soon
            </span>
          </div>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className={mutedText}>Password</span>
              <span className="font-semibold">Protected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={mutedText}>Two-factor auth</span>
              <span className="font-semibold">Not enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={mutedText}>Device alerts</span>
              <span className="font-semibold">Planned</span>
            </div>
          </div>
          <p className={`mt-4 text-xs ${mutedText}`}>
            This area will add 2FA setup, device history, and login alerts.
          </p>
        </div>

        <div className={`rounded-3xl border p-6 ${surface}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className={accentText}>
                  <Palette className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-semibold">Preferences</h2>
              </div>
              <p className={`mt-2 ${mutedText}`}>
                Choose how TypingAI looks and communicates with you.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-sm">
            <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
              <span className={mutedText}>Theme</span>
              <span className="font-semibold capitalize">{theme}</span>
            </div>
            <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
              <span className={mutedText}>Email tips</span>
              <span className="font-semibold">Weekly</span>
            </div>
            <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
              <span className={mutedText}>Practice reminders</span>
              <span className="font-semibold">Enabled</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`rounded-3xl border p-6 ${surface}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Notification center</h3>
            <p className={`mt-2 ${mutedText}`}>
              Decide which session updates and streak alerts matter most.
            </p>
          </div>
          <button
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)] hover:shadow-[0_22px_48px_rgba(34,211,238,0.45)]'
                : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] hover:shadow-[0_22px_48px_rgba(14,165,233,0.35)]'
            }`}
          >
            <Bell className="h-4 w-4" />
            Manage alerts
          </button>
        </div>
      </section>
    </div>
  );
}
