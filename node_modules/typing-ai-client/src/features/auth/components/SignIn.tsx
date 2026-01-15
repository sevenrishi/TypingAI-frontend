import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, loadUser } from '../authSlice';
import { useTheme } from '../../../providers/ThemeProvider';

export default function SignIn({ onClose, onSwitch }: { onClose: () => void; onSwitch?: () => void }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
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
      const loginResult = await dispatch(login({ email, password }) as any).unwrap();
      // Ensure token is set before making the next request
      if (loginResult?.token) {
        localStorage.setItem('token', loginResult.token);
      }
      await dispatch(loadUser() as any);
      onClose();
    } catch (err: any) {
      // Extract error message from API response
      const errorMessage = err?.payload?.error || err?.message || 'Email or password is wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200'
    }`}>
      <form onSubmit={handleSubmit} className={`p-8 rounded-lg w-96 shadow-2xl border transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white border-gray-700'
          : 'bg-gradient-to-b from-white to-gray-50 text-gray-900 border-gray-300'
      }`}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">Welcome Back</h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to continue typing
          </p>
        </div>

        {error && (
          <div className={`mb-4 p-3 border rounded text-sm ${
            theme === 'dark'
              ? 'bg-red-500/20 border-red-500/50 text-red-300'
              : 'bg-red-100 border-red-300 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className={`text-xs font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Email Address
          </label>
          <input
            value={email}
            onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
            type="email"
            className={`w-full p-3 rounded-lg border mt-1 outline-none transition ${
              emailError
                ? `border-red-500 focus:border-red-400 ${
                    theme === 'dark'
                      ? 'bg-gray-700/50'
                      : 'bg-red-50'
                  }`
                : `${
                    theme === 'dark'
                      ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-500'
                      : 'bg-gray-50 border-gray-300 focus:border-indigo-600'
                  }`
            }`}
            placeholder="your@email.com"
          />
          {emailError && <div className="text-xs text-red-500 mt-1">{emailError}</div>}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label className={`text-xs font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <button
              type="button"
              className={`text-xs ${
                theme === 'dark'
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              Forgot?
            </button>
          </div>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className={`w-full p-3 rounded-lg border mt-1 outline-none transition ${
              theme === 'dark'
                ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-500'
                : 'bg-gray-50 border-gray-300 focus:border-indigo-600'
            }`}
            placeholder="••••••••"
          />
        </div>

        <button
          disabled={loading || !email || !password || !!emailError}
          className={`w-full px-4 py-2.5 rounded-lg font-semibold transition shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-gray-600 disabled:to-gray-600 text-white'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400 text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="inline-block animate-spin">⟳</span> Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>

        <div className={`mt-4 text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => onSwitch && onSwitch()}
            className={`font-semibold ${
              theme === 'dark'
                ? 'text-indigo-400 hover:text-indigo-300'
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            Sign up
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`w-full mt-3 px-4 py-2 text-sm rounded-lg border transition ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300 border-gray-600 hover:border-gray-500'
              : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400'
          }`}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
