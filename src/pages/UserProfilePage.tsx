import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePage from '../features/user/components/ProfilePage';

export default function UserProfilePage() {
  const navigate = useNavigate();

  return (
    <ProfilePage onClose={() => navigate('/')} />
  );
}
