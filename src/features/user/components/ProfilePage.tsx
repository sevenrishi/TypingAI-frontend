import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateAvatar } from '../profileSlice';
import { RootState } from '../../../store';
import { useTheme } from '../../../providers/ThemeProvider';
import { getAvatarColor } from '../../../utils/avatars';
import axios from 'axios';
import { BarChart3, Pencil, Sparkles, Swords } from 'lucide-react';

function initials(name?: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Get list of avatar images from assets/avatars
const getAvatarImages = (): { name: string; src: string }[] => {
  const avatarImages: { name: string; src: string }[] = [];
  // Import all images from assets/avatars folder
  const context = import.meta.glob<{ default: string }>('/src/assets/avatars/*', {
    eager: true,
    import: 'default',
  });
  Object.entries(context).forEach(([path, src]) => {
    const filename = path.split('/').pop();
    if (filename) {
      avatarImages.push({
        name: filename.replace(/\.[^.]+$/, ''),
        src: src,
      });
    }
  });
  return avatarImages;
};

function colorForAccuracy(acc: number) {
  // 0-50 red, 50-80 yellow, 80-100 green
  if (acc >= 90) return 'bg-green-500';
  if (acc >= 75) return 'bg-yellow-400';
  if (acc >= 50) return 'bg-orange-400';
  return 'bg-red-500';
}

export default function ProfilePage({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const profile = useSelector((s: RootState) => s.profile);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(profile.user?.avatarId || '');
  const [avatarImages, setAvatarImages] = useState<{ name: string; src: string }[]>([]);
  const [stats, setStats] = useState<any>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProfile() as any);
    setAvatarImages(getAvatarImages());

    // Fetch statistics
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/sessions/stats/${profile.user?._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (profile.user?._id) {
      fetchStats();
    }
  }, [dispatch, profile.user?._id]);

  useEffect(() => {
    if (profile.user?.avatarId) {
      setSelectedAvatarId(profile.user.avatarId);
    }
  }, [profile.user?.avatarId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false);
      }
    };
    if (showAvatarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAvatarMenu]);

  const recent = Array.isArray(profile.history) ? profile.history.slice().reverse() : [];
  const isDark = theme === 'dark';

  const displayName = profile.user?.displayName || 'Guest';
  const email = profile.user?.email || 'No email on file';
  const totalTests = Array.isArray(profile.history) ? profile.history.length : 0;
  const hasHistory = totalTests > 0;
  const bestWpm = hasHistory ? Math.round(profile.bestWPM || 0) : null;
  const avgAccuracy = hasHistory ? Math.round(profile.averageAccuracy || 0) : null;

  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100 backdrop-blur-md'
    : 'bg-white/60 border-slate-200 text-slate-900 backdrop-blur-md';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentText = isDark ? 'text-cyan-300' : 'text-sky-600';
  const strongText = isDark ? 'text-slate-100' : 'text-slate-900';

  const handleAvatarSelect = async (avatarName: string) => {
    setSelectedAvatarId(avatarName);
    try {
      await dispatch(updateAvatar(avatarName) as any);
      setShowAvatarMenu(false);
    } catch (err) {
      console.error('Failed to update avatar', err);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      <section
        className={`relative overflow-visible rounded-[32px] border p-8 md:p-10 ${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[32px]">
          <div className={`absolute inset-0 ${isDark ? 'hero-grid-dark' : 'hero-grid-light'}`} />
          <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className={`group h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold text-white border-2 border-white/70 cursor-pointer transition-transform duration-200 hover:scale-105 ${
                    selectedAvatarId ? 'bg-slate-700' : getAvatarColor('avatar-1')
                  } overflow-hidden relative`}
                >
                  {selectedAvatarId ? (
                    <img
                      src={avatarImages.find((a) => a.name === selectedAvatarId)?.src || ''}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials(displayName)
                  )}
                  <span className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-1 right-1 h-7 w-7 rounded-full border border-white/60 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="h-3.5 w-3.5 text-white" />
                  </span>
                </div>

                {showAvatarMenu && (
                  <div
                    ref={avatarMenuRef}
                    className={`absolute z-50 mt-4 rounded-2xl shadow-2xl p-5 top-full left-0 grid grid-cols-4 gap-4 min-w-96 border ${
                      isDark ? 'bg-slate-950/95 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="col-span-4">
                      <div
                        className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        Select avatar
                      </div>
                    </div>
                    {avatarImages.length > 0 ? (
                      avatarImages.map((avatar) => (
                        <button
                          key={avatar.name}
                          onClick={() => handleAvatarSelect(avatar.name)}
                          className={`relative group w-20 h-20 rounded-full overflow-hidden transition-transform duration-200 hover:scale-110 border-2 ${
                            selectedAvatarId === avatar.name
                              ? 'border-cyan-400 ring-2 ring-cyan-300/50'
                              : isDark
                              ? 'border-slate-700 hover:border-slate-500'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                          title={avatar.name}
                        >
                          <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
                        </button>
                      ))
                    ) : (
                      <div className={`col-span-4 text-center text-sm ${mutedText}`}>No avatars found</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div
                  className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Profile overview
                </div>
                <h1
                  className="mt-2 text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
                >
                  {displayName}
                </h1>
                <div className={`mt-1 text-sm md:text-base ${mutedText}`}>{email}</div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <div className={`rounded-full border px-3 py-1 ${surfaceSoft}`}>
                    Status: <span className="font-semibold">Active</span>
                  </div>
                  <div className={`rounded-full border px-3 py-1 ${surfaceSoft}`}>
                    Sessions: <span className="font-semibold">{totalTests}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              Back to home
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className={`rounded-2xl border px-5 py-4 ${surfaceSoft}`}>
              <div
                className={`text-[10px] uppercase tracking-[0.3em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Best WPM
              </div>
              <div className={`mt-2 text-3xl font-semibold ${accentText}`}>{bestWpm ?? 'NA'}</div>
            </div>
            <div className={`rounded-2xl border px-5 py-4 ${surfaceSoft}`}>
              <div
                className={`text-[10px] uppercase tracking-[0.3em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Accuracy
              </div>
              <div className={`mt-2 text-3xl font-semibold ${accentText}`}>
                {avgAccuracy == null ? 'NA' : `${avgAccuracy}%`}
              </div>
            </div>
            <div className={`rounded-2xl border px-5 py-4 ${surfaceSoft}`}>
              <div
                className={`text-[10px] uppercase tracking-[0.3em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Total tests
              </div>
              <div className={`mt-2 text-3xl font-semibold ${accentText}`}>{totalTests}</div>
            </div>
          </div>
        </div>
      </section>

      {stats && (
        <section className={`rounded-3xl border p-6 md:p-8 ${surface}`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div
                className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Performance breakdown
              </div>
              <h2 className="mt-2 text-2xl font-semibold">Your statistics</h2>
              <p className={`mt-2 ${mutedText}`}>A quick view of your tests, practice, and battle sessions.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-2xl border p-5 ${surfaceSoft}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`h-10 w-10 rounded-xl border flex items-center justify-center ${surfaceSoft}`}>
                    <BarChart3 className={`h-5 w-5 ${accentText}`} />
                  </span>
                  <div>
                    <div className="text-lg font-semibold">Tests</div>
                    <div className={`text-sm ${mutedText}`}>Core timed sessions</div>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${accentText}`}>{stats.stats.tests.count}</div>
              </div>
              <div className={`mt-4 text-sm ${mutedText}`}>
                Avg WPM: <span className={`font-semibold ${strongText}`}>{stats.stats.tests.avgWPM}</span>
              </div>
              <div className={`text-sm ${mutedText}`}>
                Accuracy: <span className={`font-semibold ${strongText}`}>{stats.stats.tests.avgAccuracy}%</span>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${surfaceSoft}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`h-10 w-10 rounded-xl border flex items-center justify-center ${surfaceSoft}`}>
                    <Sparkles className={`h-5 w-5 ${accentText}`} />
                  </span>
                  <div>
                    <div className="text-lg font-semibold">Practice</div>
                    <div className={`text-sm ${mutedText}`}>Skill-specific drills</div>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${accentText}`}>{stats.stats.practice.count}</div>
              </div>
              <div className={`mt-4 text-sm ${mutedText}`}>
                Avg WPM: <span className={`font-semibold ${strongText}`}>{stats.stats.practice.avgWPM}</span>
              </div>
              <div className={`text-sm ${mutedText}`}>
                Accuracy: <span className={`font-semibold ${strongText}`}>{stats.stats.practice.avgAccuracy}%</span>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${surfaceSoft}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`h-10 w-10 rounded-xl border flex items-center justify-center ${surfaceSoft}`}>
                    <Swords className={`h-5 w-5 ${accentText}`} />
                  </span>
                  <div>
                    <div className="text-lg font-semibold">Battles</div>
                    <div className={`text-sm ${mutedText}`}>Competitive races</div>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${accentText}`}>{stats.stats.battles.count}</div>
              </div>
              <div className={`mt-4 text-sm ${mutedText}`}>
                Avg WPM: <span className={`font-semibold ${strongText}`}>{stats.stats.battles.avgWPM}</span>
              </div>
              <div className={`text-sm ${mutedText}`}>
                Accuracy: <span className={`font-semibold ${strongText}`}>{stats.stats.battles.avgAccuracy}%</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={`rounded-3xl border p-6 md:p-8 ${surface}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div
              className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Accuracy grid
            </div>
            <h3 className="mt-2 text-xl font-semibold">Typing performance matrix</h3>
            <p className={`mt-2 ${mutedText}`}>Each tile captures your accuracy in recent sessions.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-10 gap-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const r = recent[i];
            const acc = r ? Math.round(r.accuracy) : null;
            const cls =
              acc == null
                ? isDark
                  ? 'bg-slate-800/60'
                  : 'bg-slate-200/70'
                : colorForAccuracy(acc);
            const title = r ? `${Math.round(r.wpm)} wpm - ${Math.round(r.accuracy)}%` : 'No data';
            return (
              <div
                key={i}
                title={title}
                className={`h-10 rounded-lg flex items-center justify-center text-xs font-medium ${
                  r ? 'text-white' : mutedText
                } ${cls} transition-transform hover:scale-105`}
              >
                {r ? Math.round(r.accuracy) + '%' : ''}
              </div>
            );
          })}
        </div>
      </section>

      <section className={`rounded-3xl border p-6 md:p-8 ${surface}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div
              className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Session history
            </div>
            <h3 className="mt-2 text-xl font-semibold">Recent tests</h3>
            <p className={`mt-2 ${mutedText}`}>Review your latest runs and keep track of progress.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
          {recent.length === 0 && (
            <div className={`text-center py-8 ${mutedText}`}>
              No test history yet. Start practicing to see your progress here!
            </div>
          )}
          {recent.map((r: any) => (
            <div
              key={r._id}
              className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 transition-colors duration-300 ${surfaceSoft}`}
            >
              <div className="flex-1 min-w-[220px]">
                <div className="font-medium">{r.text?.slice(0, 80) || 'Test'}...</div>
                <div className={`text-sm ${mutedText}`}>{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${accentText}`}>{Math.round(r.wpm)} WPM</div>
                <div className={`text-sm ${mutedText}`}>
                  {Math.round(r.accuracy)}% - {r.errors} err
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
