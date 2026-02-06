import React, { useState } from 'react';
import { verifyResetCode, resetPassword } from '../../../api/passwordResetService';
import { useTheme } from '../../../providers/ThemeProvider';

interface ResetPasswordProps {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ResetPassword({ email, onClose, onSuccess }: ResetPasswordProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetCodeError, setResetCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateResetCode = (code: string) => {
    const valid = /^\d{6}$/.test(code);
    setResetCodeError(!valid && code ? 'Reset code must be 6 digits' : '');
    return valid || !code;
  };

  const validatePassword = (pwd: string) => {
    const valid = pwd.length >= 6;
    setPasswordError(!valid && pwd ? 'Password must be at least 6 characters' : '');
    return valid || !pwd;
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateResetCode(resetCode)) {
      setResetCodeError('Reset code must be 6 digits');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await verifyResetCode({ email, resetCode });
      setStep('reset');
      setError(null);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to verify reset code';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resetPassword({
        email,
        resetCode,
        newPassword,
        confirmPassword,
      });
      onSuccess();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to reset password';
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
      <form 
        onSubmit={step === 'verify' ? handleVerifyCode : handleResetPassword}
        className={`p-8 rounded-lg w-96 shadow-2xl border transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white border-gray-700'
            : 'bg-gradient-to-b from-white to-gray-50 text-gray-900 border-gray-300'
        }`}
      >
        {step === 'verify' ? (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">Verify Reset Code</h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter the 6-digit code sent to your email
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

            <div className="mb-6">
              <label className={`text-xs font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Reset Code
              </label>
              <input
                value={resetCode}
                onChange={e => {
                  const value = e.target.value.slice(0, 6);
                  setResetCode(value);
                  if (value) validateResetCode(value);
                }}
                type="text"
                inputMode="numeric"
                placeholder="000000"
                disabled={loading}
                maxLength={6}
                className={`w-full p-3 rounded-lg border mt-1 outline-none transition text-center text-2xl font-mono tracking-widest ${
                  resetCodeError
                    ? `border-red-500 focus:border-red-400 ${
                        theme === 'dark'
                          ? 'bg-slate-900/50'
                          : 'bg-red-50'
                      }`
                    : `${
                        theme === 'dark'
                          ? 'bg-slate-900/50 border-slate-700 focus:border-cyan-400 disabled:border-slate-700 disabled:opacity-50'
                          : 'bg-white border-slate-200 focus:border-sky-500 disabled:border-slate-200 disabled:opacity-50'
                      }`
                }`}
              />
              {resetCodeError && <div className="text-xs text-red-500 mt-1">{resetCodeError}</div>}
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                The code will expire in 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !resetCode || resetCodeError.length > 0}
              className={`w-full px-4 py-2.5 rounded-lg font-semibold transition shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 disabled:from-gray-600 disabled:to-gray-600 text-slate-900'
                  : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:from-sky-600 hover:via-cyan-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block animate-spin">⟳</span> Verifying...
                </span>
              ) : (
                'Verify Code'
              )}
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">Create New Password</h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter a strong password to secure your account
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
                New Password
              </label>
              <div className="relative">
                <input
                  value={newPassword}
                  onChange={e => {
                    setNewPassword(e.target.value);
                    if (e.target.value) validatePassword(e.target.value);
                  }}
                  type={showNewPassword ? 'text' : 'password'}
                  disabled={loading}
                  className={`w-full p-3 rounded-lg border mt-1 outline-none transition ${
                    passwordError
                      ? `border-red-500 focus:border-red-400 ${
                          theme === 'dark'
                            ? 'bg-slate-900/50'
                            : 'bg-red-50'
                        }`
                      : `${
                          theme === 'dark'
                            ? 'bg-slate-900/50 border-slate-700 focus:border-cyan-400 disabled:border-slate-700 disabled:opacity-50'
                            : 'bg-white border-slate-200 focus:border-sky-500 disabled:border-slate-200 disabled:opacity-50'
                        }`
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300 disabled:opacity-50'
                      : 'text-gray-600 hover:text-gray-700 disabled:opacity-50'
                  }`}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordError && <div className="text-xs text-red-500 mt-1">{passwordError}</div>}
            </div>

            <div className="mb-6">
              <label className={`text-xs font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  disabled={loading}
                  className={`w-full p-3 rounded-lg border mt-1 outline-none transition ${
                    confirmPassword && newPassword !== confirmPassword
                      ? `border-red-500 focus:border-red-400 ${
                          theme === 'dark'
                            ? 'bg-slate-900/50'
                            : 'bg-red-50'
                        }`
                      : `${
                          theme === 'dark'
                            ? 'bg-slate-900/50 border-slate-700 focus:border-cyan-400 disabled:border-slate-700 disabled:opacity-50'
                            : 'bg-white border-slate-200 focus:border-sky-500 disabled:border-slate-200 disabled:opacity-50'
                        }`
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300 disabled:opacity-50'
                      : 'text-gray-600 hover:text-gray-700 disabled:opacity-50'
                  }`}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <div className="text-xs text-red-500 mt-1">Passwords do not match</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || passwordError.length > 0}
              className={`w-full px-4 py-2.5 rounded-lg font-semibold transition shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 disabled:from-gray-600 disabled:to-gray-600 text-slate-900'
                  : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:from-sky-600 hover:via-cyan-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block animate-spin">⟳</span> Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className={`w-full mt-3 px-4 py-2 text-sm rounded-lg border transition ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300 border-gray-600 hover:border-gray-500 disabled:opacity-50'
              : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 disabled:opacity-50'
          }`}
        >
          {step === 'verify' ? 'Back to Sign In' : 'Cancel'}
        </button>
      </form>
    </div>
  );
}
