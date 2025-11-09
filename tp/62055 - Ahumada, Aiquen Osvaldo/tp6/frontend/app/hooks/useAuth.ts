"use client";

import { useState, useEffect } from 'react';
import { getToken, getUser, logout } from '../services/auth';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const syncAuth = () => {
      setToken(getToken());
      setUser(getUser());
    };
    syncAuth();
    const interval = setInterval(syncAuth, 500);
    window.addEventListener('storage', syncAuth);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  function signOut() {
    logout();
    setToken(null);
    setUser(null);
  }

  return { token, user, signOut, isAuthenticated: !!token };
}
