import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TypingPage from './pages/TypingPage';
import BattlegroundPage from './pages/BattlegroundPage';
import PracticePage from './pages/PracticePage';
import LearnPage from './pages/LearnPage';
import UserProfilePage from './pages/UserProfilePage';
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

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const auth = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Show loader for 2.5 seconds on app startup
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="app-shell py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex flex-wrap items-end justify-center gap-1">
              <span
                className={`text-5xl font-medium tracking-tight ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}
                style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
              >
                Typing
              </span>
              <span
                className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400"
                style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
              >
                AI
              </span>
            </div>
          </Link>

            <nav className={`flex items-center gap-3 px-3 py-2 rounded-xl border shadow-md ${
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

            <div className="flex items-center gap-3">
            {!auth.user ? (
              <>
                <button onClick={() => setShowSignIn(true)} className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 border ${
                  theme === 'dark'
                    ? 'bg-sky-500 text-slate-900 border-sky-300 shadow-inner hover:bg-sky-400'
                    : 'bg-sky-600 text-white border-sky-300 shadow-inner hover:bg-sky-700'
                }`}>Sign In</button>
                <button onClick={() => setShowSignUp(true)} className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 border ${
                  theme === 'dark'
                    ? 'bg-emerald-400 text-slate-900 border-emerald-300 shadow-inner hover:bg-emerald-300'
                    : 'bg-emerald-500 text-white border-emerald-300 shadow-inner hover:bg-emerald-600'
                }`}>Sign Up</button>
              </>
            ) : null}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center ${
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
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                  </svg>
                )}
              </div>
            </button>
            {auth.user && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  aria-label="Open profile menu"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                  </svg>
                </button>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-52 rounded-lg border shadow-xl z-50 overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-white border-slate-200'
                  }`}>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-slate-200 hover:bg-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-slate-200 hover:bg-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Account Settings
                    </Link>
                    <Link
                      to="/learn"
                      onClick={() => setShowProfileMenu(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-slate-200 hover:bg-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Help Center
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-rose-300 hover:bg-slate-900'
                          : 'text-rose-600 hover:bg-slate-50'
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </header>

        <main className="app-shell py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/typing" element={<ProtectedRoute element={<TypingPage />} onShowSignIn={() => setShowSignIn(true)} />} />
            <Route path="/practice" element={<ProtectedRoute element={<PracticePage />} onShowSignIn={() => setShowSignIn(true)} />} />
            <Route path="/learn" element={<ProtectedRoute element={<LearnPage />} onShowSignIn={() => setShowSignIn(true)} />} />
            <Route path="/battleground" element={<ProtectedRoute element={<BattlegroundPage />} onShowSignIn={() => setShowSignIn(true)} />} />
            <Route path="/profile" element={<ProtectedRoute element={<UserProfilePage />} onShowSignIn={() => setShowSignIn(true)} />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/activate" element={<ActivationPage />} />
          </Routes>
        </main>
      </div>
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitch={() => { setShowSignIn(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitch={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </div>
  );
}
