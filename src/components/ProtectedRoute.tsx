import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
  element: React.ReactElement;
  onShowSignIn: () => void;
}

export default function ProtectedRoute({ element, onShowSignIn }: ProtectedRouteProps) {
  const auth = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (!auth.user) {
      onShowSignIn();
    }
  }, [auth.user, onShowSignIn]);

  if (!auth.user) {
    return null;
  }

  return element;
}
