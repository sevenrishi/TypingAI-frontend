import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ResultsModal({ visible, onClose, stats, onSave }:
  { visible: boolean; onClose: () => void; stats: { wpm: number; cpm: number; accuracy: number; errors: number; elapsed: number }; onSave?: () => void }) {
  const { theme } = useTheme();

  if (!visible) return null;

  // Data for bar chart
  const chartData = [
    { name: 'WPM', value: Math.round(stats.wpm), fill: '#6366f1' },
    { name: 'CPM', value: Math.round(stats.cpm / 10), fill: '#8b5cf6' },
    { name: 'Accuracy', value: Math.round(stats.accuracy), fill: '#10b981' },
  ];

  // Data for pie chart (accuracy vs errors)
  const accuracyData = [
    { name: 'Correct', value: Math.round(stats.accuracy), fill: '#10b981' },
    { name: 'Errors', value: Math.round(100 - stats.accuracy), fill: '#ef4444' },
  ];

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 overflow-auto ${
      theme === 'dark'
        ? 'bg-black/40'
        : 'bg-black/20'
    }`}>
      <div className={`p-8 rounded-lg max-w-2xl mx-auto shadow-2xl transition-colors duration-300 my-4 ${
        theme === 'dark'
          ? 'bg-gray-800'
          : 'bg-white'
      }`}>
        <h3 className={`text-2xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Test Results</h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100'
          }`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              WPM
            </div>
            <div className="text-2xl font-bold text-indigo-500">{Math.round(stats.wpm)}</div>
          </div>
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100'
          }`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              CPM
            </div>
            <div className="text-2xl font-bold text-purple-500">{Math.round(stats.cpm)}</div>
          </div>
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100'
          }`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Accuracy
            </div>
            <div className="text-2xl font-bold text-green-500">{Math.round(stats.accuracy)}%</div>
          </div>
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100'
          }`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Errors
            </div>
            <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-700/50'
              : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Performance Metrics
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#ddd'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#999' : '#666'} />
                <YAxis stroke={theme === 'dark' ? '#999' : '#666'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                    border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                    borderRadius: '6px',
                    color: theme === 'dark' ? '#fff' : '#000'
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-700/50'
              : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
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
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                    border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                    borderRadius: '6px',
                    color: theme === 'dark' ? '#fff' : '#000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Info */}
        <div className={`p-4 rounded mb-6 ${
          theme === 'dark'
            ? 'bg-gray-700/50'
            : 'bg-blue-50'
        }`}>
          <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Total Time: <span className="text-lg font-bold text-blue-500">{Math.ceil(stats.elapsed / 1000)}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
            }`}
          >
            Close
          </button>
          <button
            onClick={onSave}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Save Result
          </button>
        </div>
      </div>
    </div>
  );
}
