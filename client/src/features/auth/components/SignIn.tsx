import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, loadUser } from '../authSlice';

export default function SignIn({ onClose, onSwitch }: { onClose: () => void; onSwitch?: () => void }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (e: string) => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    setEmailError(!valid && e ? 'Invalid email format' : '');
    return valid || !e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email) || !password) return;
    setLoading(true);
    setError(null);
    try {
      await dispatch(login({ email, password }) as any).unwrap();
      await dispatch(loadUser() as any);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8 rounded-lg w-96 shadow-2xl border border-gray-700">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">Welcome Back</h3>
          <p className="text-xs text-gray-400 mt-1">Sign in to continue typing</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs text-gray-300 font-medium">Email Address</label>
          <input
            value={email}
            onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
            type="email"
            className={`w-full p-3 rounded-lg bg-gray-700/50 border mt-1 outline-none transition ${
              emailError ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-indigo-500'
            }`}
            placeholder="your@email.com"
          />
          {emailError && <div className="text-xs text-red-400 mt-1">{emailError}</div>}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-300 font-medium">Password</label>
            <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot?</button>
          </div>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-indigo-500 mt-1 outline-none transition"
            placeholder="••••••••"
          />
        </div>

        <button
          disabled={loading || !email || !password || !!emailError}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition shadow-lg"
        >
          {loading ? <span className="flex items-center justify-center"><span className="inline-block animate-spin">⟳</span> Signing in...</span> : 'Sign In'}
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <button type="button" onClick={() => onSwitch && onSwitch()} className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign up
          </button>
        </div>

        <button type="button" onClick={onClose} className="w-full mt-3 px-4 py-2 text-gray-400 hover:text-gray-300 text-sm rounded-lg border border-gray-600 hover:border-gray-500 transition">
          Cancel
        </button>
      </form>
    </div>
  );
}
