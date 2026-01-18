import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TypingPage from './pages/TypingPage';
import BattlegroundPage from './pages/BattlegroundPage';
import PracticePage from './pages/PracticePage';
import LearnPage from './pages/LearnPage';
import UserProfilePage from './pages/UserProfilePage';
import ProfilePage from './features/user/components/ProfilePage';
import SignIn from './features/auth/components/SignIn';
import SignUp from './features/auth/components/SignUp';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout } from './features/auth/authSlice';
import { useTheme } from './providers/ThemeProvider';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const auth = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();

  return (
    <div>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100' 
          : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'
      }`}>
        <header className={`p-6 flex items-center justify-between max-w-6xl mx-auto border-b transition-colors duration-300 ${
          theme === 'dark' 
            ? 'border-gray-700' 
            : 'border-gray-200'
        }`}>
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md font-bold ${
              theme === 'dark'
                ? 'bg-indigo-500 text-white'
                : 'bg-indigo-600 text-white'
            }`}>TI</div>
            <div>
              <h1 className="text-2xl font-bold">Typing AI</h1>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Practice • Compete • Improve</div>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/" className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-100'
                : 'hover:bg-gray-200 text-gray-900'
            }`}>Home</Link>
            <Link to="/practice" className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-100'
                : 'hover:bg-gray-200 text-gray-900'
            }`}>Practice</Link>
            <Link to="/typing" className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-100'
                : 'hover:bg-gray-200 text-gray-900'
            }`}>Typing Test</Link>
            
            <Link to="/learn" className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-100'
                : 'hover:bg-gray-200 text-gray-900'
            }`}>Learn</Link>
            <Link to="/battleground" className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-100'
                : 'hover:bg-gray-200 text-gray-900'
            }`}>Typing Battleground</Link>
          </nav>

          <div className="flex items-center gap-3">
            {auth.user ? (
              <>
                <Link to="/profile" className={`px-3 py-1 rounded transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                }`}>Profile</Link>
                <button onClick={() => dispatch(logout())} className={`px-3 py-1 rounded transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}>Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => setShowSignIn(true)} className={`px-3 py-1 rounded transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-indigo-600 hover:bg-indigo-500'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}>Sign In</button>
                <button onClick={() => setShowSignUp(true)} className={`px-3 py-1 rounded transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-500'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}>Sign Up</button>
              </>
            )}
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
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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
          </div>
        </header>

        <main className="p-6 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/typing" element={<TypingPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/battleground" element={<BattlegroundPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </main>
      </div>
      {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitch={() => { setShowSignIn(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitch={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </div>
  );
}
