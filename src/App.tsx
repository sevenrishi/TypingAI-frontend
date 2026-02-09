import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TypingPage from './pages/TypingPage';
import BattlegroundPage from './pages/BattlegroundPage';
import PracticePage from './pages/PracticePage';
import LearnPage from './pages/LearnPage';
import UserProfilePage from './pages/UserProfilePage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ActivationPage from './pages/ActivationPage';
import SignIn from './features/auth/components/SignIn';
import SignUp from './features/auth/components/SignUp';
import TypingLoader from './components/TypingLoader';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout } from './features/auth/authSlice';
import { useTheme } from './providers/ThemeProvider';
import { getAvatarColor, getAvatarImageSrc } from './utils/avatars';
import api from './api/axios';
import ToastHost from './components/ToastHost';
import { LifeBuoy, LogOut, Moon, Settings, Sun, User } from 'lucide-react';

function initials(name?: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const auth = useSelector((s: RootState) => s.auth);
  const profile = useSelector((s: RootState) => s.profile);
  const dispatch = useDispatch();
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const mobileNavButtonRef = useRef<HTMLButtonElement | null>(null);
  const openSignIn = useCallback(() => setShowSignIn(true), []);

  const displayName = profile.user?.displayName || auth.user?.displayName || 'Member';
  const email = profile.user?.email || auth.user?.email || 'No email on file';
  const avatarSrc = getAvatarImageSrc(profile.user?.avatarId || auth.user?.avatarId);
  const hasHistory = Array.isArray(profile.history) && profile.history.length > 0;
  const totalTests = Array.isArray(profile.history) ? profile.history.length : 0;
  const testsCount = sessionStats?.stats?.tests?.count ?? totalTests;
  const practiceCount = sessionStats?.stats?.practice?.count ?? 0;
  const battlesCount = sessionStats?.stats?.battles?.count ?? 0;
  const bestWpm = sessionStats?.user?.bestWPM != null
    ? Math.round(sessionStats.user.bestWPM)
    : (hasHistory ? Math.round(profile.bestWPM || 0) : null);
  const avgAccuracy = sessionStats?.user?.averageAccuracy != null
    ? Math.round(sessionStats.user.averageAccuracy)
    : (hasHistory ? Math.round(profile.averageAccuracy || 0) : null);

  const menuSurface = theme === 'dark'
    ? 'bg-slate-950 border-slate-800'
    : 'bg-white border-slate-200';
  const menuText = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const menuMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const menuHover = theme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-slate-50';
  const menuChip = theme === 'dark'
    ? 'bg-slate-900/70 border-slate-800'
    : 'bg-slate-50 border-slate-200';
  const menuIcon = theme === 'dark' ? 'text-cyan-200' : 'text-sky-600';

  useEffect(() => {
    // Show loader for 2.5 seconds on app startup
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target as Node) &&
        mobileNavButtonRef.current &&
        !mobileNavButtonRef.current.contains(event.target as Node)
      ) {
        setShowMobileNav(false);
      }
    };
    if (showMobileNav) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileNav]);

  useEffect(() => {
    if (location.pathname === '/reset-password') {
      setShowSignIn(false);
      setShowSignUp(false);
    }
  }, [location.pathname]);

  return (
    <div>
      <TypingLoader isLoading={isLoading} duration={2500} />
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100' 
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900'
      }`}>
        <header className={`border-b transition-colors duration-300 ${
          theme === 'dark' 
            ? 'border-slate-800 bg-slate-950/60' 
            : 'border-slate-200 bg-white/70'
        }`}>
          <div className="app-shell py-4 flex items-center justify-between max-lg:items-center max-lg:gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileNav(prev => !prev)}
                className={`inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-colors lg:hidden ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                aria-label="Toggle navigation"
                aria-expanded={showMobileNav}
                ref={mobileNavButtonRef}
              >
                <span className="sr-only">Toggle navigation</span>
                <div className="flex flex-col gap-1">
                  <span className={`h-0.5 w-5 rounded-full transition ${theme === 'dark' ? 'bg-slate-200' : 'bg-slate-700'}`} />
                  <span className={`h-0.5 w-5 rounded-full transition ${theme === 'dark' ? 'bg-slate-200' : 'bg-slate-700'}`} />
                  <span className={`h-0.5 w-5 rounded-full transition ${theme === 'dark' ? 'bg-slate-200' : 'bg-slate-700'}`} />
                </div>
              </button>
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="flex flex-wrap items-end justify-center gap-1">
                  <span
                    className={`text-5xl font-medium tracking-tight ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    } max-sm:text-4xl`}
                    style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
                  >
                    Typing
                  </span>
                  <span
                    className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 max-sm:text-4xl"
                    style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
                  >
                    AI
                  </span>
                </div>
              </Link>
            </div>

            <nav className={`flex items-center gap-3 px-3 py-2 rounded-xl border shadow-md max-lg:hidden ${
              theme === 'dark'
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-white/80 border-slate-200'
            }`}>
              <NavLink to="/" end className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-200 border ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40 -translate-y-0.5'
                    : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50 -translate-y-0.5'
                  : theme === 'dark'
                  ? 'bg-slate-900/70 text-slate-200 border-slate-700 shadow-inner hover:bg-slate-800/80'
                  : 'bg-white text-slate-700 border-slate-200 shadow-inner hover:bg-slate-50'
              }`}>Home</NavLink>
              <NavLink to="/practice" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-200 border ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40 -translate-y-0.5'
                    : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50 -translate-y-0.5'
                  : theme === 'dark'
                  ? 'bg-slate-900/70 text-slate-200 border-slate-700 shadow-inner hover:bg-slate-800/80'
                  : 'bg-white text-slate-700 border-slate-200 shadow-inner hover:bg-slate-50'
              }`}>Practice</NavLink>
              <NavLink to="/typing" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-200 border ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40 -translate-y-0.5'
                    : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50 -translate-y-0.5'
                  : theme === 'dark'
                  ? 'bg-slate-900/70 text-slate-200 border-slate-700 shadow-inner hover:bg-slate-800/80'
                  : 'bg-white text-slate-700 border-slate-200 shadow-inner hover:bg-slate-50'
              }`}>Typing Test</NavLink>
              <NavLink to="/learn" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-200 border ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40 -translate-y-0.5'
                    : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50 -translate-y-0.5'
                  : theme === 'dark'
                  ? 'bg-slate-900/70 text-slate-200 border-slate-700 shadow-inner hover:bg-slate-800/80'
                  : 'bg-white text-slate-700 border-slate-200 shadow-inner hover:bg-slate-50'
              }`}>Learn</NavLink>
              <NavLink to="/battleground" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-200 border ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40 -translate-y-0.5'
                    : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50 -translate-y-0.5'
                  : theme === 'dark'
                  ? 'bg-slate-900/70 text-slate-200 border-slate-700 shadow-inner hover:bg-slate-800/80'
                  : 'bg-white text-slate-700 border-slate-200 shadow-inner hover:bg-slate-50'
              }`}>Battleground</NavLink>
            </nav>

            <div className="flex items-center gap-3 max-lg:gap-2">
            {!auth.user ? (
              <>
                <button onClick={() => setShowSignIn(true)} className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 border max-lg:hidden ${
                  theme === 'dark'
                    ? 'bg-sky-500 text-slate-900 border-sky-300 shadow-inner hover:bg-sky-400'
                    : 'bg-sky-600 text-white border-sky-300 shadow-inner hover:bg-sky-700'
                }`}>Sign In</button>
                <button onClick={() => setShowSignUp(true)} className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 border max-lg:hidden ${
                  theme === 'dark'
                    ? 'bg-emerald-400 text-slate-900 border-emerald-300 shadow-inner hover:bg-emerald-300'
                    : 'bg-emerald-500 text-white border-emerald-300 shadow-inner hover:bg-emerald-600'
                }`}>Sign Up</button>
              </>
            ) : null}
            <button
              onClick={toggleTheme}
              className={`no-key relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center ${
                theme === 'dark'
                  ? 'bg-gray-700'
                  : 'bg-gray-300'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <div
                className={`absolute w-7 h-7 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-0.5' : 'translate-x-6'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-cyan-300" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </button>
            {auth.user && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  className={`no-key w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-slate-200 border-cyan-400/70 hover:bg-slate-800 hover:border-cyan-300'
                      : 'bg-white text-slate-700 border-sky-300 hover:bg-slate-50 hover:border-sky-400'
                  }`}
                  aria-label="Open profile menu"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                  </svg>
                </button>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-3 w-80 rounded-2xl border shadow-xl z-50 overflow-hidden ${menuSurface} ${menuText} max-md:fixed max-md:top-20 max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto max-md:mt-0 max-md:w-[92vw] max-md:overflow-auto max-md:max-h-[80vh]`}>
                    <div className={`px-4 py-4 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white overflow-hidden ${
                            avatarSrc ? 'bg-slate-800' : getAvatarColor(profile.user?.avatarId)
                          }`}
                        >
                          {avatarSrc ? (
                            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            initials(displayName)
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{displayName}</div>
                          <div className={`text-xs ${menuMuted} truncate`}>{email}</div>
                          <div
                            className={`mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] ${menuMuted}`}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Active
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className={`rounded-lg border px-2 py-2 ${menuChip}`}>
                          <div
                            className={`text-[10px] uppercase tracking-[0.2em] ${menuMuted}`}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Best WPM
                          </div>
                          <div className="mt-1 text-sm font-semibold">{bestWpm ?? '--'}</div>
                        </div>
                        <div className={`rounded-lg border px-2 py-2 ${menuChip}`}>
                          <div
                            className={`text-[10px] uppercase tracking-[0.2em] ${menuMuted}`}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Accuracy
                          </div>
                          <div className="mt-1 text-sm font-semibold">{avgAccuracy == null ? '--' : `${avgAccuracy}%`}</div>
                        </div>
                        <div className={`rounded-lg border px-2 py-2 ${menuChip}`}>
                          <div
                            className={`text-[10px] uppercase tracking-[0.2em] ${menuMuted}`}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Tests
                          </div>
                          <div className="mt-1 text-sm font-semibold">{testsCount}</div>
                        </div>
                        <div className={`rounded-lg border px-2 py-2 ${menuChip}`}>
                          <div
                            className={`text-[10px] uppercase tracking-[0.2em] ${menuMuted}`}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Practice
                          </div>
                          <div className="mt-1 text-sm font-semibold">{practiceCount}</div>
                        </div>
                        <div className={`rounded-lg border px-2 py-2 ${menuChip}`}>
                          <div
                            className={`text-[10px] uppercase tracking-[0.2em] ${menuMuted}`}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Battles
                          </div>
                          <div className="mt-1 text-sm font-semibold">{battlesCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className={`group flex items-start gap-3 px-4 py-3 text-sm transition-colors ${menuHover}`}
                      >
                        <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${menuChip}`}>
                          <User className={`w-4 h-4 ${menuIcon}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">Profile</div>
                          <div className={`text-xs ${menuMuted}`}>Avatar, stats, and recent sessions.</div>
                        </div>
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setShowProfileMenu(false)}
                        className={`group flex items-start gap-3 px-4 py-3 text-sm transition-colors ${menuHover}`}
                      >
                        <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${menuChip}`}>
                          <Settings className={`w-4 h-4 ${menuIcon}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">Account Settings</div>
                          <div className={`text-xs ${menuMuted}`}>Security, preferences, and defaults.</div>
                        </div>
                      </Link>
                      <Link
                        to="/help"
                        onClick={() => setShowProfileMenu(false)}
                        className={`group flex items-start gap-3 px-4 py-3 text-sm transition-colors ${menuHover}`}
                      >
                        <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${menuChip}`}>
                          <LifeBuoy className={`w-4 h-4 ${menuIcon}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">Help Center</div>
                          <div className={`text-xs ${menuMuted}`}>Guides, FAQs, and support.</div>
                        </div>
                      </Link>
                    </div>
                    <div className={`border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setShowProfileMenu(false);
                        }}
                        className={`no-key w-full rounded-t-none rounded-b-2xl flex items-start gap-3 px-4 py-3 text-sm transition-colors ${menuHover} ${
                          theme === 'dark' ? 'text-rose-300' : 'text-rose-600'
                        }`}
                      >
                        <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${menuChip}`}>
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">Sign Out</div>
                          <div className={`text-xs ${menuMuted}`}>End this session safely.</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          {showMobileNav && (
            <div className={`lg:hidden border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <div ref={mobileNavRef} className="app-shell py-4">
                <div className={`rounded-2xl border p-4 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-slate-950/80 border-slate-800 text-slate-100'
                    : 'bg-white/90 border-slate-200 text-slate-900'
                }`}>
                  <div className="grid grid-cols-2 gap-3">
                    <NavLink
                      to="/"
                      end
                      onClick={() => setShowMobileNav(false)}
                      className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40'
                            : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50'
                          : theme === 'dark'
                          ? 'bg-slate-900/70 text-slate-200 border-slate-700 hover:bg-slate-800/80'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Home
                    </NavLink>
                    <NavLink
                      to="/practice"
                      onClick={() => setShowMobileNav(false)}
                      className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40'
                            : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50'
                          : theme === 'dark'
                          ? 'bg-slate-900/70 text-slate-200 border-slate-700 hover:bg-slate-800/80'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Practice
                    </NavLink>
                    <NavLink
                      to="/typing"
                      onClick={() => setShowMobileNav(false)}
                      className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40'
                            : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50'
                          : theme === 'dark'
                          ? 'bg-slate-900/70 text-slate-200 border-slate-700 hover:bg-slate-800/80'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Typing Test
                    </NavLink>
                    <NavLink
                      to="/learn"
                      onClick={() => setShowMobileNav(false)}
                      className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40'
                            : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50'
                          : theme === 'dark'
                          ? 'bg-slate-900/70 text-slate-200 border-slate-700 hover:bg-slate-800/80'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Learn
                    </NavLink>
                    <NavLink
                      to="/battleground"
                      onClick={() => setShowMobileNav(false)}
                      className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/40'
                            : 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-300/50'
                          : theme === 'dark'
                          ? 'bg-slate-900/70 text-slate-200 border-slate-700 hover:bg-slate-800/80'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Battleground
                    </NavLink>
                    {!auth.user && (
                      <div className="col-span-2 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setShowMobileNav(false);
                            setShowSignIn(true);
                          }}
                          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                            theme === 'dark'
                              ? 'bg-slate-900/70 text-slate-200 border-slate-700 hover:bg-slate-800/80'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            setShowMobileNav(false);
                            setShowSignUp(true);
                          }}
                          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                            theme === 'dark'
                              ? 'bg-emerald-400 text-slate-900 border-emerald-300 shadow-lg shadow-emerald-500/40'
                              : 'bg-emerald-500 text-white border-emerald-300 shadow-lg shadow-emerald-300/50'
                          }`}
                        >
                          Sign Up
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="app-shell py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/typing" element={<ProtectedRoute element={<TypingPage />} onShowSignIn={openSignIn} />} />
            <Route path="/practice" element={<ProtectedRoute element={<PracticePage />} onShowSignIn={openSignIn} />} />
            <Route path="/learn" element={<ProtectedRoute element={<LearnPage />} onShowSignIn={openSignIn} />} />
            <Route path="/battleground" element={<ProtectedRoute element={<BattlegroundPage />} onShowSignIn={openSignIn} />} />
            <Route path="/profile" element={<ProtectedRoute element={<UserProfilePage />} onShowSignIn={openSignIn} />} />
            <Route path="/account" element={<ProtectedRoute element={<AccountSettingsPage />} onShowSignIn={openSignIn} />} />
            <Route path="/help" element={<ProtectedRoute element={<HelpCenterPage />} onShowSignIn={openSignIn} />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/activate" element={<ActivationPage />} />
          </Routes>
        </main>
      </div>
      <ToastHost />
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitch={() => { setShowSignIn(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitch={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </div>
  );
}
