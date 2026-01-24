import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../providers/ThemeProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Session {
  _id: string;
  type: 'practice' | 'test' | 'battle';
  wpm: number;
  accuracy: number;
  duration: number;
  errors: number;
  battleResult?: string;
  opponent?: string;
  difficulty?: string;
  createdAt: string;
}

export default function UserHistory() {
  const { theme } = useTheme();
  const auth = useSelector((s: RootState) => s.auth);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'test' | 'practice' | 'battle'>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!auth.user) return;
    fetchSessions();
    fetchStats();
  }, [auth.user, selectedType, page]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = selectedType !== 'all' ? { type: selectedType } : {};
      const response = await axios.get(`/api/sessions/user/${auth.user?._id}`, {
        params: { ...params, page, limit: 10 },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/api/sessions/stats/${auth.user?._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'test': return '⌨️';
      case 'practice': return '✍️';
      case 'battle': return '🏁';
      default: return '📊';
    }
  };

  const getSessionBadge = (type: string) => {
    switch (type) {
      case 'test':
        return theme === 'dark'
          ? 'bg-blue-900/40 text-blue-300'
          : 'bg-blue-100 text-blue-700';
      case 'practice':
        return theme === 'dark'
          ? 'bg-purple-900/40 text-purple-300'
          : 'bg-purple-100 text-purple-700';
      case 'battle':
        return theme === 'dark'
          ? 'bg-orange-900/40 text-orange-300'
          : 'bg-orange-100 text-orange-700';
      default: return theme === 'dark'
        ? 'bg-gray-800 text-gray-300'
        : 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className={`rounded-lg p-6 ${
          theme === 'dark'
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-2xl font-bold mb-6 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Your Statistics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Overall Stats */}
            <div className={`rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-3xl font-black mb-2 text-blue-500">{stats.user.bestWPM || 0}</div>
              <div className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Best WPM</div>
            </div>

            <div className={`rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-3xl font-black mb-2 text-purple-500">{stats.user.averageAccuracy || 0}%</div>
              <div className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Avg Accuracy</div>
            </div>

            <div className={`rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-3xl font-black mb-2 text-green-500">{(stats.stats.tests.count + stats.stats.practice.count + stats.stats.battles.count) || 0}</div>
              <div className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Total Sessions</div>
            </div>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tests */}
            <div className={`rounded-lg p-4 border-l-4 border-blue-500 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-sm font-semibold mb-2">Tests</div>
              <div className="text-2xl font-bold mb-1">{stats.stats.tests.count}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg WPM: {stats.stats.tests.avgWPM} | Acc: {stats.stats.tests.avgAccuracy}%
              </div>
            </div>

            {/* Practice */}
            <div className={`rounded-lg p-4 border-l-4 border-purple-500 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-sm font-semibold mb-2">Practice</div>
              <div className="text-2xl font-bold mb-1">{stats.stats.practice.count}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg WPM: {stats.stats.practice.avgWPM} | Acc: {stats.stats.practice.avgAccuracy}%
              </div>
            </div>

            {/* Battles */}
            <div className={`rounded-lg p-4 border-l-4 border-orange-500 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-sm font-semibold mb-2">Battles</div>
              <div className="text-2xl font-bold mb-1">{stats.stats.battles.count}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg WPM: {stats.stats.battles.avgWPM} | Acc: {stats.stats.battles.avgAccuracy}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['all', 'test', 'practice', 'battle'] as const).map((type) => (
          <button
            key={type}
            onClick={() => { setSelectedType(type); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedType === type
                ? theme === 'dark'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type === 'all' ? '📊 All' : getSessionIcon(type) + ' ' + type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className={`text-center py-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Loading...
        </div>
      ) : sessions.length === 0 ? (
        <div className={`text-center py-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          No sessions yet. Start typing to create your first session!
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session._id}
              className={`rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg ${getSessionBadge(session.type)}`}>
                  {getSessionIcon(session.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{session.type}</span>
                    {session.battleResult && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        session.battleResult === 'win'
                          ? 'bg-green-500/20 text-green-400'
                          : session.battleResult === 'loss'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {session.battleResult.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {formatDate(session.createdAt)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{session.wpm} WPM</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {session.accuracy}% | {session.errors} errors
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
