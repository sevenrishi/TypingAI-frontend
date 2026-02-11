import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ResultsModal({ visible, onClose, stats, onSave }:
  { visible: boolean; onClose: () => void; stats: { wpm: number; cpm: number; accuracy: number; errors: number; elapsed: number }; onSave?: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const surface = isDark
    ? 'bg-slate-900/80 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100'
    : 'bg-white/60 border-slate-200/80 text-slate-900';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const tooltipTextColor = isDark ? '#ffffff' : '#0f172a';

  const renderPerformanceTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    const name = entry?.payload?.name ?? entry?.name ?? '';
    const value = entry?.value ?? '';
    return (
      <div className={`text-xs font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        {`${name}:${value}`}
      </div>
    );
  };

  if (!visible) return null;

  // Data for bar chart
  const chartData = [
    { name: 'WPM', value: Math.round(stats.wpm), fill: '#22d3ee' },
    { name: 'CPM', value: Math.round(stats.cpm / 10), fill: '#38bdf8' },
    { name: 'Accuracy', value: Math.round(stats.accuracy), fill: '#34d399' },
  ];

  // Data for pie chart (accuracy vs errors)
  const accuracyData = [
    { name: 'Correct', value: Math.round(stats.accuracy), fill: '#34d399' },
    { name: 'Errors', value: Math.round(100 - stats.accuracy), fill: '#f87171' },
  ];

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 overflow-auto ${
      isDark ? 'bg-black/60' : 'bg-slate-900/20'
    }`}>
      <div className={`p-8 rounded-3xl max-w-2xl mx-auto shadow-2xl transition-colors duration-300 my-4 border ${surface}`}>
        <h3 className="text-2xl font-bold mb-6">Test Results</h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'WPM', value: Math.round(stats.wpm), accent: isDark ? 'text-cyan-300' : 'text-sky-600' },
            { label: 'CPM', value: Math.round(stats.cpm), accent: isDark ? 'text-sky-300' : 'text-cyan-600' },
            { label: 'Accuracy', value: `${Math.round(stats.accuracy)}%`, accent: isDark ? 'text-emerald-300' : 'text-emerald-600' },
            { label: 'Errors', value: stats.errors, accent: isDark ? 'text-rose-300' : 'text-rose-600' },
          ].map((stat) => (
            <div key={stat.label} className={`p-4 rounded-2xl border ${surfaceSoft}`}>
              <div className={`text-[11px] uppercase tracking-[0.28em] ${mutedText}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {stat.label}
              </div>
              <div className={`mt-2 text-2xl font-bold ${stat.accent}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className={`p-4 rounded-2xl border ${surfaceSoft}`}>
            <h4 className="text-sm font-semibold mb-4">
              Performance Metrics
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                <Tooltip cursor={false} content={renderPerformanceTooltip} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className={`p-4 rounded-2xl border ${surfaceSoft}`}>
            <h4 className="text-sm font-semibold mb-4">
              Accuracy Distribution
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    color: tooltipTextColor
                  }}
                  itemStyle={{ color: tooltipTextColor }}
                  labelStyle={{ color: tooltipTextColor }}
                  separator=": "
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Info */}
        <div className={`p-4 rounded-2xl border mb-6 ${surfaceSoft}`}>
          <div className="text-sm font-medium">
            Total Time: <span className={`text-lg font-bold ${isDark ? 'text-cyan-300' : 'text-sky-600'}`}>{Math.ceil(stats.elapsed / 1000)}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
            }`}
          >
            Close
          </button>
          <button
            onClick={onSave}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              isDark
                ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
                : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white'
            }`}
          >
            Save Result
          </button>
        </div>
      </div>
    </div>
  );
}
