import React, { useState } from 'react';
import { forgotPassword } from '../../../api/passwordResetService';
import { useTheme } from '../../../providers/ThemeProvider';

interface ForgotPasswordProps {
  onClose: () => void;
  onVerifyCode: (email: string) => void;
}

export default function ForgotPassword({ onClose, onVerifyCode }: ForgotPasswordProps) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (e: string) => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    setEmailError(!valid && e ? 'Invalid email format' : '');
    return valid || !e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email) || !email) {
      setEmailError('Valid email is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await forgotPassword({ email });
      setSuccess(true);
      // Auto-proceed after 2 seconds
      setTimeout(() => {
        onVerifyCode(email);
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to send reset code';
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
          <h3 className="text-2xl font-bold">Reset Password</h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter your email to receive a reset code
          </p>
        </div>

        {success && (
          <div className={`mb-4 p-3 border rounded text-sm ${
            theme === 'dark'
              ? 'bg-green-500/20 border-green-500/50 text-green-300'
              : 'bg-green-100 border-green-300 text-green-700'
          }`}>
            Reset code sent! Redirecting you to enter the code...
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

        <div className="mb-6">
          <label className={`text-xs font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Email Address
          </label>
          <input
            value={email}
            onChange={e => { 
              setEmail(e.target.value);
              if (e.target.value) validateEmail(e.target.value);
            }}
            type="email"
            disabled={loading || success}
            className={`w-full p-3 rounded-lg border mt-1 outline-none transition ${
              emailError
                ? `border-red-500 focus:border-red-400 ${
                    theme === 'dark'
                      ? 'bg-gray-700/50'
                      : 'bg-red-50'
                  }`
                : `${
                    theme === 'dark'
                      ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-500 disabled:border-gray-700 disabled:opacity-50'
                      : 'bg-gray-50 border-gray-300 focus:border-indigo-600 disabled:border-gray-200 disabled:opacity-50'
                  }`
            }`}
            placeholder="your@email.com"
          />
          {emailError && <div className="text-xs text-red-500 mt-1">{emailError}</div>}
        </div>

        <button
          type="submit"
          disabled={loading || !email || !!emailError || success}
          className={`w-full px-4 py-2.5 rounded-lg font-semibold transition shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-gray-600 disabled:to-gray-600 text-white'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400 text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="inline-block animate-spin">⟳</span> Sending...
            </span>
          ) : success ? (
            <span className="flex items-center justify-center">
              <span className="inline-block animate-spin">✓</span> Code Sent!
            </span>
          ) : (
            'Send Reset Code'
          )}
        </button>

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
          Back to Sign In
        </button>
      </form>
    </div>
  );
}
