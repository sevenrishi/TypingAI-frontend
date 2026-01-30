import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from '../features/auth/components/SignIn';
import { useTheme } from '../providers/ThemeProvider';

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200'
    }`}>
      <SignIn 
        onClose={() => navigate('/')} 
        onSwitch={() => navigate('/signup')}
      />
    </div>
  );
}
