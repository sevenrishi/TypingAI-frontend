import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, loadUser, googleAuth } from '../authSlice';
import { fetchProfile } from '../../user/profileSlice';
import { useTheme } from '../../../providers/ThemeProvider';
import { useGoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';

export default function SignIn({ onClose, onSwitch }: { onClose: () => void; onSwitch?: () => void }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = Boolean(googleClientId);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      dispatch(fetchProfile() as any);
      onClose();
    } catch (err: any) {
      // Extract error message from API response
      const errorMessage = err?.error || err?.message || 'Email or password is wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    navigate('/');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(googleAuth({ accessToken: tokenResponse.access_token }) as any).unwrap();
        if (result?.token) {
          localStorage.setItem('token', result.token);
        }
        await dispatch(loadUser() as any);
        dispatch(fetchProfile() as any);
        onClose();
      } catch (err: any) {
        setError(err?.error || err?.message || 'Google sign-in failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed');
    },
    scope: 'openid email profile'
  });

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 overflow-auto max-md:px-4 max-md:py-6 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200'
    }`}>
      <form onSubmit={handleSubmit} className={`p-6 rounded-lg w-full max-w-[22rem] shadow-2xl border transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white border-gray-700'
          : 'bg-gradient-to-b from-white to-gray-50 text-gray-900 border-gray-300'
      }`}>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">Welcome Back</h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to continue typing
          </p>
        </div>

        {success && (
          <div className={`mb-4 p-3 border rounded text-sm ${
            theme === 'dark'
              ? 'bg-green-500/20 border-green-500/50 text-green-300'
              : 'bg-green-100 border-green-300 text-green-700'
          }`}>
            {success}
          </div>
        )}

        {error && (
          <div className={`mb-4 p-3 border rounded text-sm ${
            theme === 'dark'
              ? 'bg-red-500/20 border-red-500/50 text-red-300'
              : 'bg-red-100 border-red-300 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className={`text-xs font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Email Address
          </label>
          <input
            value={email}
            onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
            type="email"
            className={`w-full p-2.5 rounded-lg border mt-1 outline-none transition ${
              emailError
                ? `border-red-500 focus:border-red-400 ${
                    theme === 'dark'
                      ? 'bg-slate-900/50'
                      : 'bg-red-50'
                  }`
                : `${
                    theme === 'dark'
                      ? 'bg-slate-900/50 border-slate-700 focus:border-cyan-400'
                      : 'bg-white border-slate-200 focus:border-sky-500'
                  }`
            }`}
            placeholder="your@email.com"
          />
          {emailError && <div className="text-xs text-red-500 mt-1">{emailError}</div>}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center">
            <label className={`text-xs font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                navigate('/reset-password');
              }}
              className={`no-key text-xs ${
                theme === 'dark'
                  ? 'text-cyan-300 hover:text-cyan-200'
                  : 'text-sky-600 hover:text-sky-700'
              }`}
            >
              Forgot Password?
            </button>
          </div>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className={`w-full p-2.5 rounded-lg border mt-1 outline-none transition ${
              theme === 'dark'
                ? 'bg-slate-900/50 border-slate-700 focus:border-cyan-400'
                : 'bg-white border-slate-200 focus:border-sky-500'
            }`}
            placeholder="••••••••"
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>or</span>
            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </div>
          <div className="mt-2 flex justify-center">
            {isGoogleConfigured ? (
              <button
                type="button"
                onClick={() => googleLogin()}
                className={`w-full max-w-[320px] px-4 py-2 rounded-md border text-sm font-semibold transition flex items-center justify-center gap-3 shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gray-900 text-gray-100 border-gray-700 hover:bg-gray-800'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </span>
                Continue with Google
              </button>
            ) : (
              <button
                type="button"
                disabled
                className={`w-full max-w-[320px] px-4 py-2 rounded-md border text-sm font-medium transition ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-400 border-gray-700'
                    : 'bg-gray-100 text-gray-500 border-gray-300'
                }`}
                title="Google OAuth client ID is not configured"
              >
                Continue with Google
              </button>
            )}
          </div>
          {!isGoogleConfigured && (
            <div className={`mt-2 text-xs text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Google sign-in is not configured.
            </div>
          )}
        </div>

        <button
          disabled={loading || !email || !password || !!emailError}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 disabled:from-gray-600 disabled:to-gray-600 text-slate-900'
              : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:from-sky-600 hover:via-cyan-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Signing in...</span>
            </span>
          ) : (
            'Sign In'
          )}
        </button>

        <div className={`mt-3 text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => onSwitch && onSwitch()}
            className={`no-key font-semibold ${
              theme === 'dark'
                ? 'text-cyan-300 hover:text-cyan-200'
                : 'text-sky-600 hover:text-sky-700'
            }`}
          >
            Sign up
          </button>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className={`w-full mt-2 px-4 py-2 text-sm rounded-lg border transition ${
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
