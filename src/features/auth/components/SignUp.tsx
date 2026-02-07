import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { register, loadUser } from '../authSlice';
import { useTheme } from '../../../providers/ThemeProvider';

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
    ? { score, label: 'Good', color: 'bg-cyan-500' }
    : { score, label: 'Strong', color: 'bg-emerald-500' };
}

export default function SignUp({ onClose, onSwitch }: { onClose: () => void; onSwitch?: () => void }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
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

  const isFormValid = displayName && email && !emailError && password && confirmPassword === password && !confirmError;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 overflow-auto transition-colors duration-300 max-md:px-4 max-md:py-6 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200'
    }`}>
      <form onSubmit={handleSubmit} className={`p-8 rounded-lg w-full max-w-[24rem] shadow-2xl border my-4 transition-colors duration-300 ${
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
                ? 'bg-slate-900/50 border-slate-700 focus:border-emerald-400'
                : 'bg-white border-slate-200 focus:border-emerald-500'
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
                      ? 'bg-slate-900/50'
                      : 'bg-red-50'
                  }`
                : `${
                    theme === 'dark'
                      ? 'bg-slate-900/50 border-slate-700 focus:border-emerald-400'
                      : 'bg-white border-slate-200 focus:border-emerald-500'
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
                ? 'bg-slate-900/50 border-slate-700 focus:border-emerald-400'
                : 'bg-white border-slate-200 focus:border-emerald-500'
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
                    : strength.color === 'bg-cyan-500'
                    ? 'text-cyan-500'
                    : 'text-emerald-500'
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
                      ? 'bg-slate-900/50'
                      : 'bg-red-50'
                  }`
                : `${
                    theme === 'dark'
                      ? 'bg-slate-900/50 border-slate-700 focus:border-emerald-400'
                      : 'bg-white border-slate-200 focus:border-emerald-500'
                  }`
            }`}
            placeholder="••••••••"
          />
          {confirmError && <div className="text-xs text-red-500 mt-1">{confirmError}</div>}
        </div>

        <button
          disabled={loading || !isFormValid}
          className={`w-full px-4 py-2.5 rounded-lg font-semibold transition shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 disabled:from-gray-600 disabled:to-gray-600 text-slate-900'
              : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:from-sky-600 hover:via-cyan-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="inline-block animate-spin">⟳</span> Creating...
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
            className={`no-key font-semibold ${
              theme === 'dark'
                ? 'text-cyan-300 hover:text-cyan-200'
                : 'text-sky-600 hover:text-sky-700'
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
