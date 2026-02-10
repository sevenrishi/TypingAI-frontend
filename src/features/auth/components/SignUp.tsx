import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { register, loadUser, googleAuth } from '../authSlice';
import { useTheme } from '../../../providers/ThemeProvider';
import { useGoogleLogin } from '@react-oauth/google';

function getPasswordStrength(pwd: string) {
  if (!pwd) return { score: 0, label: '', color: 'bg-gray-400' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[!@#$%^&*]/.test(pwd)) score++;
  return score <= 1
    ? { score, label: 'Weak', color: 'bg-red-500' }
    : score === 2
    ? { score, label: 'Fair', color: 'bg-yellow-500' }
    : score === 3
    ? { score, label: 'Good', color: 'bg-blue-500' }
    : { score, label: 'Strong', color: 'bg-green-500' };
}

export default function SignUp({ onClose, onSwitch }: { onClose: () => void; onSwitch?: () => void }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = Boolean(googleClientId);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const validateEmail = (e: string) => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    setEmailError(!valid && e ? 'Invalid email format' : '');
    return valid || !e;
  };

  const handleConfirmChange = (val: string) => {
    setConfirmPassword(val);
    setConfirmError(val && val !== password ? 'Passwords do not match' : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !validateEmail(email) || !password || confirmPassword !== password) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await dispatch(register({ email, password, displayName }) as any).unwrap();
      setSuccess(result.message || 'Registration successful! Please check your email to activate your account.');
    } catch (err: any) {
      setError(err?.error || err?.message || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const result = await dispatch(googleAuth({ accessToken: tokenResponse.access_token }) as any).unwrap();
        if (result?.token) {
          localStorage.setItem('token', result.token);
        }
        await dispatch(loadUser() as any);
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

  const isFormValid = displayName && email && !emailError && password && confirmPassword === password && !confirmError;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 overflow-auto transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200'
    }`}>
      <form onSubmit={handleSubmit} className={`p-8 rounded-lg w-96 shadow-2xl border my-4 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white border-gray-700'
          : 'bg-gradient-to-b from-white to-gray-50 text-gray-900 border-gray-300'
      }`}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">Create Account</h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Join the typing revolution
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

        {success && (
          <div className={`mb-4 p-3 border rounded text-sm ${
            theme === 'dark'
              ? 'bg-green-500/20 border-green-500/50 text-green-300'
              : 'bg-green-100 border-green-300 text-green-700'
          }`}>
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className={`text-xs font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Display Name
          </label>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className={`w-full p-3 rounded-lg border mt-1 outline-none transition ${
              theme === 'dark'
                ? 'bg-gray-700/50 border-gray-600 focus:border-green-500'
                : 'bg-gray-50 border-gray-300 focus:border-green-600'
            }`}
            placeholder="John Doe"
          />
        </div>

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
                      ? 'bg-gray-700/50 border-gray-600 focus:border-green-500'
                      : 'bg-gray-50 border-gray-300 focus:border-green-600'
                  }`
            }`}
            placeholder="your@email.com"
          />
          {emailError && <div className="text-xs text-red-500 mt-1">{emailError}</div>}
        </div>

        <div className="mb-4">
          <label className={`text-xs font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Password
          </label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className={`w-full p-3 rounded-lg border mt-1 outline-none transition ${
              theme === 'dark'
                ? 'bg-gray-700/50 border-gray-600 focus:border-green-500'
                : 'bg-gray-50 border-gray-300 focus:border-green-600'
            }`}
            placeholder="••••••••"
          />
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Strength
                </span>
                <span className={`text-xs font-semibold ${
                  strength.color === 'bg-red-500'
                    ? 'text-red-500'
                    : strength.color === 'bg-yellow-500'
                    ? 'text-yellow-500'
                    : strength.color === 'bg-blue-500'
                    ? 'text-blue-500'
                    : 'text-green-500'
                }`}>
                  {strength.label}
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <div className={`h-full ${strength.color} transition`} style={{ width: `${(strength.score / 5) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className={`text-xs font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={e => handleConfirmChange(e.target.value)}
            type="password"
            className={`w-full p-3 rounded-lg border mt-1 outline-none transition ${
              confirmError
                ? `border-red-500 focus:border-red-400 ${
                    theme === 'dark'
                      ? 'bg-gray-700/50'
                      : 'bg-red-50'
                  }`
                : `${
                    theme === 'dark'
                      ? 'bg-gray-700/50 border-gray-600 focus:border-green-500'
                      : 'bg-gray-50 border-gray-300 focus:border-green-600'
                  }`
            }`}
            placeholder="••••••••"
          />
          {confirmError && <div className="text-xs text-red-500 mt-1">{confirmError}</div>}
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>or</span>
            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </div>
          <div className="mt-3 flex justify-center">
            {isGoogleConfigured ? (
              <button
                type="button"
                onClick={() => googleLogin()}
                className={`w-full max-w-[320px] px-4 py-2.5 rounded-md border text-sm font-semibold transition flex items-center justify-center gap-3 shadow-sm ${
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
                className={`w-full max-w-[320px] px-4 py-2.5 rounded-md border text-sm font-medium transition ${
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
          disabled={loading || !isFormValid}
          className={`w-full px-4 py-2.5 rounded-lg font-semibold transition shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-600 text-white'
              : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              Creating
              <span className="flex items-center gap-[3px] ml-1">
                <span className="w-[5px] h-[5px] bg-white rounded-full animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
                <span className="w-[5px] h-[5px] bg-white rounded-full animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                <span className="w-[5px] h-[5px] bg-white rounded-full animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
              </span>
            </span>
          ) : (
            'Create Account'
          )}
        </button>

        <div className={`mt-4 text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => onSwitch && onSwitch()}
            className={`font-semibold ${
              theme === 'dark'
                ? 'text-indigo-400 hover:text-indigo-300'
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            Sign in
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
