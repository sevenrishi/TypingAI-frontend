import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from '../features/auth/components/ForgotPassword';
import ResetPassword from '../features/auth/components/ResetPassword';
import { useTheme } from '../providers/ThemeProvider';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [step, setStep] = useState<'forgot' | 'reset'>('forgot');
  const [resetEmail, setResetEmail] = useState('');

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200'
    }`}>
      {step === 'forgot' ? (
        <ForgotPassword
          onClose={() => navigate('/login')}
          onVerifyCode={(email: string) => {
            setResetEmail(email);
            setStep('reset');
          }}
        />
      ) : (
        <ResetPassword
          email={resetEmail}
          onClose={() => navigate('/login')}
          onSuccess={() => {
            navigate('/login');
          }}
        />
      )}
    </div>
  );
}
