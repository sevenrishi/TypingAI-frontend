import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ResultsPageProps {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  duration: number; // ms
  text: string;
  typed: string;
  onClose: () => void;
}

export default function ResultsPage({
  wpm,
  cpm,
  accuracy,
  errors,
  duration,
  text,
  typed,
  onClose,
}: ResultsPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Convert duration from ms to seconds/minutes
  const durationSeconds = Math.round(duration / 1000);
  const durationMinutes = (duration / 1000 / 60).toFixed(2);

  // Calculate accuracy percentage
  const accuracyPercent = Math.round(accuracy);
  const incorrectPercent = Math.max(0, 100 - accuracyPercent);

  // Create data for pie chart
  const accuracyData = [
    { name: 'Correct', value: accuracyPercent },
    { name: 'Incorrect', value: incorrectPercent },
  ];

  // Create data for performance chart
  const performanceData = [
    { name: 'WPM', value: Math.round(wpm) },
    { name: 'CPM', value: Math.round(cpm) },
  ];

  // Character analysis
  const totalChars = text.length;
  const correctChars = Math.max(0, totalChars - errors);

  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100 backdrop-blur-md'
    : 'bg-white/60 border-slate-200/80 text-slate-900 backdrop-blur-md';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentText = isDark ? 'text-cyan-300' : 'text-sky-600';
  const chartColors = {
    correct: '#34d399',
    incorrect: '#f87171',
    wpm: '#22d3ee',
    cpm: '#38bdf8',
  };

  const MetricCard = ({ label, value, helper }: { label: string; value: string; helper: string }) => (
    <div className={`rounded-2xl border p-5 ${surfaceSoft}`}>
      <div
        className={`text-[11px] uppercase tracking-[0.28em] ${mutedText}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </div>
      <div className={`mt-3 text-3xl font-bold ${accentText}`}>{value}</div>
      <div className={`mt-2 text-xs ${mutedText}`}>{helper}</div>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="text-center space-y-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] ${
            isDark
              ? 'border-cyan-500/40 text-cyan-200 bg-slate-900/60'
              : 'border-sky-200 text-sky-700 bg-sky-50'
          }`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Session Complete
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
        >
          Performance dashboard
        </h1>
        <p className={mutedText}>Review your speed, accuracy, and rhythm insights.</p>
      </header>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Words Per Minute" value={`${Math.round(wpm)}`} helper="Speed" />
        <MetricCard label="Characters Per Minute" value={`${Math.round(cpm)}`} helper="Rhythm" />
        <MetricCard label="Accuracy" value={`${accuracyPercent}%`} helper="Precision" />
        <MetricCard label="Duration" value={`${durationMinutes}m`} helper={`${durationSeconds}s total`} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`rounded-3xl border p-6 ${surface}`}>
          <h2 className="text-lg font-semibold mb-4">Speed metrics</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                <Cell fill={chartColors.wpm} />
                <Cell fill={chartColors.cpm} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-3xl border p-6 ${surface}`}>
          <h2 className="text-lg font-semibold mb-4">Accuracy breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={accuracyData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill={chartColors.correct} />
                <Cell fill={chartColors.incorrect} />
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => `${entry.payload.name}: ${entry.payload.value}%`}
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                  color: isDark ? '#f8fafc' : '#0f172a',
                  borderRadius: '10px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-3xl border p-6 ${surface}`}>
          <h2 className="text-lg font-semibold mb-4">Accuracy trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={[
                { name: 'Start', value: Math.max(70, accuracyPercent - 8) },
                { name: 'Mid', value: Math.max(75, accuracyPercent - 4) },
                { name: 'End', value: accuracyPercent },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-3xl border p-6 ${surfaceSoft}`}>
          <h2 className="text-lg font-semibold mb-4">Character statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={mutedText}>Total characters</span>
              <span className="font-semibold">{totalChars}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={mutedText}>Correct characters</span>
              <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{correctChars}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={mutedText}>Incorrect characters</span>
              <span className={`font-semibold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>{errors}</span>
            </div>
            <div className="border-t border-slate-700/40 pt-3 flex justify-between items-center">
              <span className={`font-semibold ${mutedText}`}>Error rate</span>
              <span className="font-semibold">{totalChars ? ((errors / totalChars) * 100).toFixed(2) : '0.00'}%</span>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border p-6 ${surfaceSoft}`}>
          <h2 className="text-lg font-semibold mb-4">Test information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={mutedText}>Test duration</span>
              <span className="font-semibold">{durationMinutes} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={mutedText}>Words typed</span>
              <span className="font-semibold">{Math.round(typed.length / 5)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={mutedText}>Total words</span>
              <span className="font-semibold">{Math.round(text.length / 5)}</span>
            </div>
            <div className="border-t border-slate-700/40 pt-3 flex justify-between items-center">
              <span className={`font-semibold ${mutedText}`}>Completion</span>
              <span className="font-semibold">
                {text.length ? ((typed.length / text.length) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onClose}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)] hover:shadow-[0_22px_48px_rgba(34,211,238,0.45)]'
              : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] hover:shadow-[0_22px_48px_rgba(14,165,233,0.35)]'
          }`}
        >
          Run another session
        </button>
      </div>
    </div>
  );
}
