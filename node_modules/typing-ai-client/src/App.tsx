import React, { useState } from 'react';
import TypingTest from './features/typing/components/TypingTest';
import RaceUI from './features/multiplayer/components/RaceUI';
import ProfilePage from './features/user/components/ProfilePage';
import SignIn from './features/auth/components/SignIn';
import SignUp from './features/auth/components/SignUp';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout } from './features/auth/authSlice';

export default function App() {
  const [dark, setDark] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const auth = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <header className="p-6 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">TI</div>
            <div>
              <h1 className="text-2xl font-bold">Typing AI</h1>
              <div className="text-xs text-gray-300">Practice • Race • Improve</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {auth.user ? (
              <>
                <button onClick={() => setShowProfile(true)} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">Profile</button>
                <button onClick={() => dispatch(logout())} className="px-3 py-1 rounded bg-red-600 hover:bg-red-500">Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => setShowSignIn(true)} className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500">Sign In</button>
                <button onClick={() => setShowSignUp(true)} className="px-3 py-1 rounded bg-green-600 hover:bg-green-500">Sign Up</button>
              </>
            )}
            <button onClick={() => setDark(d => !d)} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">{dark ? 'Light' : 'Dark'}</button>
          </div>
        </header>

        <main className="p-6 max-w-6xl mx-auto">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TypingTest />
            </div>
            <div>
              <RaceUI />
            </div>
          </section>
        </main>
      </div>
      {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitch={() => { setShowSignIn(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitch={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </div>
  );
}
