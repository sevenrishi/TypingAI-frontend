import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { register, loadUser } from '../authSlice';

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
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    try {
      await dispatch(register({ email, password, displayName }) as any).unwrap();
      await dispatch(loadUser() as any);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = displayName && email && !emailError && password && confirmPassword === password && !confirmError;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50 overflow-auto">
      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8 rounded-lg w-96 shadow-2xl border border-gray-700 my-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">Create Account</h3>
          <p className="text-xs text-gray-400 mt-1">Join the typing revolution</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs text-gray-300 font-medium">Display Name</label>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-green-500 mt-1 outline-none transition"
            placeholder="John Doe"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-300 font-medium">Email Address</label>
          <input
            value={email}
            onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
            type="email"
            className={`w-full p-3 rounded-lg bg-gray-700/50 border mt-1 outline-none transition ${
              emailError ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-green-500'
            }`}
            placeholder="your@email.com"
          />
          {emailError && <div className="text-xs text-red-400 mt-1">{emailError}</div>}
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-300 font-medium">Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-green-500 mt-1 outline-none transition"
            placeholder="••••••••"
          />
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Strength</span>
                <span className={`text-xs font-semibold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition`} style={{ width: `${(strength.score / 5) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="text-xs text-gray-300 font-medium">Confirm Password</label>
          <input
            value={confirmPassword}
            onChange={e => handleConfirmChange(e.target.value)}
            type="password"
            className={`w-full p-3 rounded-lg bg-gray-700/50 border mt-1 outline-none transition ${
              confirmError ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-green-500'
            }`}
            placeholder="••••••••"
          />
          {confirmError && <div className="text-xs text-red-400 mt-1">{confirmError}</div>}
        </div>

        <button
          disabled={loading || !isFormValid}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition shadow-lg"
        >
          {loading ? <span className="flex items-center justify-center"><span className="inline-block animate-spin">⟳</span> Creating...</span> : 'Create Account'}
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <button type="button" onClick={() => onSwitch && onSwitch()} className="text-green-400 hover:text-green-300 font-semibold">
            Sign in
          </button>
        </div>

        <button type="button" onClick={onClose} className="w-full mt-3 px-4 py-2 text-gray-400 hover:text-gray-300 text-sm rounded-lg border border-gray-600 hover:border-gray-500 transition">
          Cancel
        </button>
      </form>
    </div>
  );
}
