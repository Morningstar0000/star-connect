// src/components/SessionMonitor.jsx (Optional - for debugging only)
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const SessionMonitor = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      console.log('Auth status:', user ? `Logged in as ${user.email}` : 'Not logged in');
    }
  }, [user, loading]);

  return null;
};