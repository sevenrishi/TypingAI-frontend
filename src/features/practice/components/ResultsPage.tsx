import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function ResultsPage({ wpm, cpm, accuracy, errors, duration, text, typed, onClose }: ResultsPageProps) {
  const { theme } = useTheme();
  
  // Convert duration from ms to seconds
  const durationSeconds = Math.round(duration / 1000);
  const durationMinutes = (duration / 1000 / 60).toFixed(2);
  
  // Calculate accuracy percentage
  const accuracyPercent = Math.round(accuracy);
  const incorrectPercent = 100 - accuracyPercent;
  
  // Create data for pie chart
  const accuracyData = [
    { name: 'Correct', value: accuracyPercent },
    { name: 'Incorrect', value: incorrectPercent }
  ];
  
  // Create data for performance chart
  const performanceData = [
    { name: 'WPM', value: Math.round(wpm) },
    { name: 'CPM', value: Math.round(cpm) }
  ];
  
  // Character analysis
  const totalChars = text.length;
  const correctChars = totalChars - errors;
  
  const chartColors = {
    correct: '#10b981',
    incorrect: '#ef4444',
    wpm: '#6366f1',
    cpm: '#8b5cf6'
  };

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';

  return (
    <div className={`min-h-screen ${bgColor} p-6`}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${textColor} mb-2`}>Test Complete! 🎉</h1>
          <p className={secondaryText}>Here's your detailed performance report</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* WPM */}
          <div className={`${cardBg} rounded-lg p-6 border ${borderColor} shadow-sm`}>
            <div className={`text-sm font-semibold ${secondaryText} mb-2`}>Words Per Minute</div>
            <div className={`text-4xl font-bold text-indigo-600`}>{Math.round(wpm)}</div>
            <div className={`text-xs ${secondaryText} mt-2`}>Speed</div>
          </div>

          {/* CPM */}
          <div className={`${cardBg} rounded-lg p-6 border ${borderColor} shadow-sm`}>
            <div className={`text-sm font-semibold ${secondaryText} mb-2`}>Characters Per Minute</div>
            <div className={`text-4xl font-bold text-purple-600`}>{Math.round(cpm)}</div>
            <div className={`text-xs ${secondaryText} mt-2`}>Speed</div>
          </div>

          {/* Accuracy */}
          <div className={`${cardBg} rounded-lg p-6 border ${borderColor} shadow-sm`}>
            <div className={`text-sm font-semibold ${secondaryText} mb-2`}>Accuracy</div>
            <div className={`text-4xl font-bold text-green-600`}>{accuracyPercent}%</div>
            <div className={`text-xs ${secondaryText} mt-2`}>Precision</div>
          </div>

          {/* Duration */}
          <div className={`${cardBg} rounded-lg p-6 border ${borderColor} shadow-sm`}>
            <div className={`text-sm font-semibold ${secondaryText} mb-2`}>Duration</div>
            <div className={`text-4xl font-bold text-blue-600`}>{durationMinutes}m</div>
            <div className={`text-xs ${secondaryText} mt-2`}>{durationSeconds}s</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* WPM vs CPM Bar Chart */}
          <div className={`${cardBg} rounded-lg p-6 border ${borderColor} shadow-sm lg:col-span-2`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Speed Metrics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="name"
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                />
                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
                  content={({ payload }: any) => {
                    if (payload && payload.length > 0) {
                      const data = payload[0].payload;
                      return <div style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827' }}>{data.name}: {payload[0].value}</div>;
                    }
                    return null;
                  }}
                  cursor={false}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  <Cell fill="#6366f1" />
                  <Cell fill="#a855f7" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Accuracy Pie Chart */}
          <div className={`${cardBg} rounded-lg p-6 border ${borderColor} shadow-sm`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Accuracy Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill={chartColors.correct} />
                  <Cell fill={chartColors.incorrect} />
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => `${entry.payload.name}: ${entry.payload.value}%`}
                />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Character Stats */}
          <div className={`${cardBg} rounded-lg p-6 border ${borderColor} shadow-sm`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Character Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={secondaryText}>Total Characters</span>
                <span className={`font-semibold ${textColor}`}>{totalChars}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={secondaryText}>Correct Characters</span>
                <span className="font-semibold text-green-600">{correctChars}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={secondaryText}>Incorrect Characters</span>
                <span className="font-semibold text-red-600">{errors}</span>
              </div>
              <div className="border-t border-gray-600 pt-3 flex justify-between items-center">
                <span className={`font-semibold ${secondaryText}`}>Error Rate</span>
                <span className={`font-semibold ${textColor}`}>{((errors / totalChars) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Test Info */}
          <div className={`${cardBg} rounded-lg p-6 border ${borderColor} shadow-sm`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Test Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={secondaryText}>Test Duration</span>
                <span className={`font-semibold ${textColor}`}>{durationMinutes} minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={secondaryText}>Words Typed</span>
                <span className={`font-semibold ${textColor}`}>{Math.round(typed.length / 5)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={secondaryText}>Total Words in Text</span>
                <span className={`font-semibold ${textColor}`}>{Math.round(text.length / 5)}</span>
              </div>
              <div className="border-t border-gray-600 pt-3 flex justify-between items-center">
                <span className={`font-semibold ${secondaryText}`}>Completion</span>
                <span className={`font-semibold ${textColor}`}>{((typed.length / text.length) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Try Another Practice
          </button>
        </div>
      </div>
    </div>
  );
}
