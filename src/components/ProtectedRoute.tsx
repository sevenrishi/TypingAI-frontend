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
    // Only show sign-in if auth check is complete and user is not logged in
    if (auth.isAuthChecked && !auth.user) {
      onShowSignIn();
    }
  }, [auth.user, auth.isAuthChecked, onShowSignIn]);

  // Show nothing while auth is being checked
  if (!auth.isAuthChecked) {
    return null;
  }

  // If user is not authenticated after check is complete, return null
  if (!auth.user) {
    return null;
  }

  return element;
}

