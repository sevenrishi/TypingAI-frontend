import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider';

type FeatureGateProps = {
  title: string;
  description: string;
  highlights: string[];
  onPrimaryAction: () => void;
  primaryActionLabel?: string;
  secondaryLink?: {
    label: string;
    to: string;
  };
  kicker?: string;
};

export default function FeatureGate({
  title,
  description,
  highlights,
  onPrimaryAction,
  primaryActionLabel = 'Sign in to start',
  secondaryLink,
  kicker = 'Member access',
}: FeatureGateProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const surface = isDark
    ? 'bg-slate-950/90 border-slate-800 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';
  const surfaceSoft = isDark
    ? 'bg-slate-900/70 border-slate-700 text-slate-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentText = isDark ? 'text-cyan-300' : 'text-sky-600';

  return (
    <section
      className={`relative overflow-hidden rounded-[32px] border p-8 md:p-10 ${surface}`}
      aria-label={`${title} preview`}
    >
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${isDark ? 'hero-grid-dark' : 'hero-grid-light'}`} />
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] ${
              isDark ? 'border-cyan-500/40 text-cyan-200 bg-slate-900/60' : 'border-sky-200 text-sky-700 bg-sky-50'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {kicker}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
          >
            {title}
          </h1>
          <p className={`text-lg ${mutedText}`}>{description}</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onPrimaryAction}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)] hover:shadow-[0_22px_48px_rgba(34,211,238,0.45)]'
                  : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] hover:shadow-[0_22px_48px_rgba(14,165,233,0.35)]'
              }`}
            >
              {primaryActionLabel}
            </button>
            {secondaryLink ? (
              <Link
                to={secondaryLink.to}
                className={`inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                {secondaryLink.label}
              </Link>
            ) : null}
          </div>
        </div>
        <div className={`rounded-3xl border p-6 ${surfaceSoft}`}>
          <div className={`text-xs uppercase tracking-[0.35em] ${accentText}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Highlights
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className={`mt-1 h-2 w-2 rounded-full ${accentText} bg-current`} aria-hidden="true" />
                <span className={mutedText}>{item}</span>
              </li>
            ))}
          </ul>
          <div className={`mt-6 rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.3em] ${surface}`}>
            Unlock full access with a free account
          </div>
        </div>
      </div>
    </section>
  );
}
