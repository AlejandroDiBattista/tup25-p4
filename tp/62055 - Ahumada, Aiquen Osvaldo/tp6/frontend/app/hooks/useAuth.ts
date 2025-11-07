"use client";

import { useState, useEffect } from 'react';
import { getToken, getUser, logout } from '../services/auth';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setToken(getToken());
    setUser(getUser());
  }, []);

  function signOut() {
    logout();
    setToken(null);
    setUser(null);
  }

  return { token, user, signOut, isAuthenticated: !!token };
}
