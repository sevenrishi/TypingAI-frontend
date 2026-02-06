import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useTheme } from '../providers/ThemeProvider';

export default function ActivationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-activated'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setStatus('error');
      setMessage('Invalid activation link. Please check your email and try again.');
      return;
    }

    const activateAccount = async () => {
      try {
        const response = await api.get('/auth/activate', {
          params: { code }
        });

        if (response.status === 200) {
          const responseMessage = response.data.message || '';
          
          if (responseMessage.includes('already activated')) {
            setStatus('already-activated');
            setMessage('Account activated successfully! You can now log in.');
          } else {
            setStatus('success');
            setMessage('Your account is now activated. You can now login to your account.');
          }
        }
      } catch (error: any) {
        console.error('Activation error:', error);
        setStatus('error');
        
        if (error.response?.data?.error) {
          setMessage(error.response.data.error);
        } else {
          setMessage('Failed to activate account. Please try again or contact support.');
        }
      }
    };

    activateAccount();
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200'
    }`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-lg shadow-2xl border transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white border-gray-700'
          : 'bg-gradient-to-b from-white to-gray-50 text-gray-900 border-gray-300'
      }`}>
        {status === 'loading' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Activating Your Account</h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Please wait while we activate your account...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-16 w-16 text-emerald-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-emerald-500">Activation Successful</h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {message}
            </p>
            <button
              onClick={handleGoToLogin}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-900'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white'
              }`}
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'already-activated' && (
          <div className="text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-16 w-16 text-cyan-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-cyan-400">Account Activated</h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {message}
            </p>
            <button
              onClick={handleGoToLogin}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 text-slate-900'
                  : 'bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 hover:from-sky-700 hover:via-cyan-600 hover:to-emerald-600 text-white'
              }`}
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-16 w-16 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-500">Activation Failed</h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white'
                }`}
              >
                Try Again
              </button>
              <button
                onClick={handleGoToLogin}
                className={`w-full px-4 py-3 rounded-lg border transition ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300 border-gray-600 hover:border-gray-500'
                    : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400'
                }`}
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
