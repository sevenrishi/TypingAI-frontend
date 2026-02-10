import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateAvatar } from '../profileSlice';
import { RootState } from '../../../store';
import { useTheme } from '../../../providers/ThemeProvider';
import {
  getAvatarColor,
  getAvatarImageSrc,
  getAvatarImages,
  normalizeAvatarId
} from '../../../utils/avatars';
import api from '../../../api/axios';
import { Award, BarChart3, Crown, Download, Facebook, Flame, Linkedin, Link, Medal, Pencil, Rocket, Share2, Sparkles, Swords, Zap } from 'lucide-react';
import { fetchStreakSnapshot, getStreakSnapshot, StreakSnapshot, toDateKey } from '../../../utils/streaks';
import CertificateCard from '../../../components/CertificateCard';
import {
  CertificateData,
  downloadCertificatePdf,
  getCertificateShareLinks,
  getCertificateShareText,
  shareCertificate
} from '../../../utils/certificates';
import { fetchUserProgress } from '../../../api/progress';

function initials(name?: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function colorForAccuracy(acc: number) {
  if (acc >= 90) return 'bg-green-500';
  if (acc >= 75) return 'bg-yellow-400';
  if (acc >= 50) return 'bg-orange-400';
  return 'bg-red-500';
}

function formatDateKey(dateKey?: string | null) {
  if (!dateKey) return 'No activity yet';
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return dateKey;
  return new Date(year, month - 1, day).toLocaleDateString();
}

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26L22.5 21.75h-6.17l-4.84-6.32-5.53 6.32H2.65l7.73-8.84L2.5 2.25h6.33l4.37 5.72 5.044-5.72zm-1.16 17.52h1.833L7.62 4.126H5.675l11.41 15.644z" />
  </svg>
);

export default function ProfilePage({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const profile = useSelector((s: RootState) => s.profile);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(normalizeAvatarId(profile.user?.avatarId));
  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [certificateCopied, setCertificateCopied] = useState(false);
  const [streakSnapshot, setStreakSnapshot] = useState<StreakSnapshot>(getStreakSnapshot());
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<number | null>(null);
  const certificateCopyTimerRef = useRef<number | null>(null);
  const avatarImages = getAvatarImages();

  useEffect(() => {
    dispatch(fetchProfile() as any);

    const fetchStats = async () => {
      try {
        const response = await api.get(`/sessions/stats/${profile.user?._id}`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    const fetchSessions = async () => {
      try {
        setSessionsLoading(true);
        const response = await api.get(`/sessions/user/${profile.user?._id}`, {
          params: { limit: 30 }
        });
        setSessions(response.data.sessions || []);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setSessionsLoading(false);
      }
    };

    const fetchProgress = async () => {
      try {
        const progress = await fetchUserProgress(toDateKey(new Date()));
        setCertificate(progress.learning?.certificate || null);
        if (progress.streak) {
          setStreakSnapshot(progress.streak);
        } else {
          const streak = await fetchStreakSnapshot();
          setStreakSnapshot(streak);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    };

    if (profile.user?._id) {
      fetchStats();
      fetchSessions();
      fetchProgress();
    }
  }, [dispatch, profile.user?._id]);

  useEffect(() => {
    if (profile.user?.avatarId) {
      setSelectedAvatarId(normalizeAvatarId(profile.user.avatarId));
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

  const recent = sessions.length > 0
    ? sessions
    : (Array.isArray(profile.history) ? profile.history.slice().reverse() : []);
  const isDark = theme === 'dark';

  const displayName = profile.user?.displayName || 'Guest';
  const email = profile.user?.email || 'No email on file';
  const totalTests = stats?.stats?.tests?.count ?? (Array.isArray(profile.history) ? profile.history.length : 0);
  const totalSessions = stats?.stats
    ? stats.stats.tests.count + stats.stats.practice.count + stats.stats.battles.count
    : totalTests;
  const hasHistory = totalTests > 0;
  const bestWpm = stats?.user?.bestWPM != null
    ? Math.round(stats.user.bestWPM)
    : (hasHistory ? Math.round(profile.bestWPM || 0) : null);
  const avgAccuracy = stats?.user?.averageAccuracy != null
    ? Math.round(stats.user.averageAccuracy)
    : (hasHistory ? Math.round(profile.averageAccuracy || 0) : null);
  const avatarSrc = getAvatarImageSrc(selectedAvatarId);
  const normalizedSelectedId = normalizeAvatarId(selectedAvatarId);
  const currentStreak = streakSnapshot.currentStreak;
  const longestStreak = streakSnapshot.longestStreak;
  const lastActiveLabel = formatDateKey(streakSnapshot.lastActiveDate);
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://typingai.app';
  const streakHeadline = currentStreak > 0
    ? `I'm on a ${currentStreak}-day typing streak on TypingAI`
    : `I'm training on TypingAI`;
  const statBits = [
    bestWpm != null ? `Best WPM: ${bestWpm}` : null,
    avgAccuracy != null ? `Accuracy: ${avgAccuracy}%` : null
  ].filter(Boolean);
  const shareText = statBits.length ? `${streakHeadline}. ${statBits.join(' | ')}.` : `${streakHeadline}.`;
  const shareTextForClipboard = shareUrl ? `${shareText} ${shareUrl}` : shareText;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}${shareUrl ? `&url=${encodedUrl}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  };
  const certificateShareText = certificate ? getCertificateShareText(certificate) : '';
  const certificateShareTextForClipboard = certificate
    ? [certificateShareText, shareUrl].filter(Boolean).join(' ')
    : '';
  const certificateShareLinks = certificate
    ? getCertificateShareLinks(certificateShareText, shareUrl)
    : { linkedin: '', twitter: '', facebook: '' };

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

  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(shareTextForClipboard);
      setCopied(true);
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy share text', err);
    }
  };

  const handleCertificateCopy = async () => {
    if (!certificateShareTextForClipboard) return;
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(certificateShareTextForClipboard);
      setCertificateCopied(true);
      if (certificateCopyTimerRef.current) {
        window.clearTimeout(certificateCopyTimerRef.current);
      }
      certificateCopyTimerRef.current = window.setTimeout(() => {
        setCertificateCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy certificate share text', err);
    }
  };

  const handleCertificateShare = async () => {
    if (!certificate) return;
    const shared = await shareCertificate(certificate, shareUrl);
    if (!shared) {
      await handleCertificateCopy();
    }
  };

  const handleCertificateDownload = () => {
    if (!certificate) return;
    void downloadCertificatePdf(certificate);
  };

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      if (certificateCopyTimerRef.current) {
        window.clearTimeout(certificateCopyTimerRef.current);
      }
    };
  }, []);

  const streakStatus = streakSnapshot.todayActive
    ? {
        label: 'Active today',
        className: isDark
          ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }
    : streakSnapshot.daysSinceActive === 1
    ? {
        label: 'Keep it alive today',
        className: isDark
          ? 'border-amber-400/40 bg-amber-500/15 text-amber-200'
          : 'border-amber-200 bg-amber-50 text-amber-700'
      }
    : {
        label: 'Start your streak',
        className: isDark
          ? 'border-slate-700 bg-slate-900/60 text-slate-300'
          : 'border-slate-200 bg-white text-slate-700'
      };

  const streakBadges = [
    { id: 'spark', label: 'Spark', days: 3, Icon: Zap },
    { id: 'steady', label: 'Steady', days: 7, Icon: Flame },
    { id: 'rising', label: 'Rising', days: 14, Icon: Rocket },
    { id: 'focused', label: 'Focused', days: 30, Icon: Award },
    { id: 'iron', label: 'Iron', days: 60, Icon: Medal },
    { id: 'legend', label: 'Legend', days: 100, Icon: Crown }
  ];

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
                    avatarSrc ? 'bg-slate-700' : getAvatarColor(selectedAvatarId || 'avatar-1')
                  } overflow-hidden relative`}
                >
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
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
                    className={`absolute z-50 mt-4 rounded-2xl shadow-2xl p-6 top-full left-0 grid grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-6 w-[26rem] h-[22rem] max-md:w-[92vw] max-md:h-[70vh] max-md:left-1/2 max-md:-translate-x-1/2 overflow-y-auto border ${
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
                            normalizedSelectedId === avatar.name
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
                    Sessions: <span className="font-semibold">{totalSessions}</span>
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

      <section className={`rounded-3xl border p-6 md:p-8 ${surface}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div
              className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Streak momentum
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Daily consistency</h2>
            <p className={`mt-2 ${mutedText}`}>Keep a daily streak going to unlock new badges.</p>
          </div>
          <div className={`rounded-full border px-4 py-2 text-xs font-semibold ${streakStatus.className}`}>
            {streakStatus.label}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-2xl border px-5 py-4 ${surfaceSoft}`}>
            <div
              className={`text-[10px] uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Current streak
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className={`h-10 w-10 rounded-xl border flex items-center justify-center ${surfaceSoft}`}>
                <Flame className={`h-5 w-5 ${accentText}`} />
              </span>
              <div className={`text-3xl font-semibold ${accentText}`}>{currentStreak}d</div>
            </div>
            <div className={`mt-2 text-sm ${mutedText}`}>
              {currentStreak > 0 ? 'Keep the pace going today.' : 'Complete a session to start.'}
            </div>
          </div>

          <div className={`rounded-2xl border px-5 py-4 ${surfaceSoft}`}>
            <div
              className={`text-[10px] uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Longest streak
            </div>
            <div className={`mt-2 text-3xl font-semibold ${accentText}`}>{longestStreak}d</div>
            <div className={`mt-2 text-sm ${mutedText}`}>Your personal best run.</div>
          </div>

          <div className={`rounded-2xl border px-5 py-4 ${surfaceSoft}`}>
            <div
              className={`text-[10px] uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Last active
            </div>
            <div className={`mt-2 text-2xl font-semibold ${strongText}`}>{lastActiveLabel}</div>
            <div className={`mt-2 text-sm ${mutedText}`}>Most recent session day.</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {streakBadges.map(({ id, label, days, Icon }) => {
            const unlocked = longestStreak >= days;
            return (
              <div
                key={id}
                className={`rounded-2xl border px-5 py-4 flex items-center gap-4 ${
                  unlocked
                    ? isDark
                      ? 'border-emerald-400/40 bg-emerald-500/10'
                      : 'border-emerald-200 bg-emerald-50'
                    : surfaceSoft
                }`}
              >
                <span
                  className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${
                    unlocked
                      ? isDark
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                        : 'bg-emerald-100 border-emerald-200 text-emerald-700'
                      : surfaceSoft
                  }`}
                >
                  <Icon className={`h-5 w-5 ${unlocked ? '' : mutedText}`} />
                </span>
                <div>
                  <div className="text-lg font-semibold">{label}</div>
                  <div className={`text-sm ${mutedText}`}>{days}-day streak</div>
                </div>
                <div className={`ml-auto text-xs font-semibold ${unlocked ? accentText : mutedText}`}>
                  {unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-6 rounded-2xl border p-5 ${surfaceSoft}`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div
                className={`text-[10px] uppercase tracking-[0.3em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Share your streak
              </div>
              <div className="mt-2 text-lg font-semibold">Invite friends to join your run</div>
              <p className={`mt-1 text-sm ${mutedText}`}>{shareText}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                <XLogo className="h-4 w-4" />
                X
              </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              <Link className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        </div>
      </section>

      <section className={`rounded-3xl border p-6 md:p-8 ${surface}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div
              className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Certificate
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Course completion</h2>
            <p className={`mt-2 ${mutedText}`}>Showcase your TypingAI learning achievement.</p>
          </div>
          {certificate && (
            <div
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                isDark
                  ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              Certified
            </div>
          )}
        </div>

        {certificate ? (
          <div className="mt-6 space-y-4">
            <CertificateCard certificate={certificate} />
            <div className="flex flex-wrap gap-3">
              <a
                href={certificateShareLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href={certificateShareLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                <XLogo className="h-4 w-4" />
                X
              </a>
              <a
                href={certificateShareLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
              <button
                onClick={handleCertificateCopy}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                <Link className="h-4 w-4" />
                {certificateCopied ? 'Copied' : 'Copy text'}
              </button>
              <button
                onClick={handleCertificateShare}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-emerald-400/60 hover:text-emerald-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={handleCertificateDownload}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-emerald-400/60 hover:text-emerald-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          <div className={`mt-6 rounded-2xl border p-5 ${surfaceSoft}`}>
            <div className="text-lg font-semibold">Complete the learning path to unlock your certificate.</div>
            <p className={`mt-1 text-sm ${mutedText}`}>
              Finish all lessons in the Learn tab to generate a shareable certificate.
            </p>
          </div>
        )}
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

        <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
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
            <h3 className="mt-2 text-xl font-semibold">Recent sessions</h3>
            <p className={`mt-2 ${mutedText}`}>Review your latest tests, practice runs, and battles.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
          {sessionsLoading && recent.length === 0 && (
            <div className={`text-center py-8 ${mutedText}`}>
              Loading sessions...
            </div>
          )}
          {!sessionsLoading && recent.length === 0 && (
            <div className={`text-center py-8 ${mutedText}`}>
              No session history yet. Start a test, practice, or battle to see your progress here!
            </div>
          )}
          {recent.map((r: any) => (
            <div
              key={r._id}
              className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 transition-colors duration-300 ${surfaceSoft}`}
            >
              <div className="flex-1 min-w-[220px] max-sm:min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {r.type && (
                    <span
                      className={`text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded-full border ${
                        r.type === 'test'
                          ? isDark
                            ? 'border-cyan-400/40 bg-cyan-500/15 text-cyan-200'
                            : 'border-sky-200 bg-sky-50 text-sky-700'
                          : r.type === 'practice'
                          ? isDark
                            ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : isDark
                          ? 'border-amber-400/40 bg-amber-500/15 text-amber-200'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {r.type}
                    </span>
                  )}
                  {r.battleResult && (
                    <span
                      className={`text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded-full border ${
                        r.battleResult === 'win'
                          ? isDark
                            ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : r.battleResult === 'loss'
                          ? isDark
                            ? 'border-rose-400/40 bg-rose-500/15 text-rose-200'
                            : 'border-rose-200 bg-rose-50 text-rose-700'
                          : isDark
                          ? 'border-amber-400/40 bg-amber-500/15 text-amber-200'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {r.battleResult}
                    </span>
                  )}
                </div>
                <div className="font-medium">{r.text?.slice(0, 80) || 'Session'}...</div>
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
