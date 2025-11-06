'use client';

import { useEffect, useState } from 'react';
import Login from '@/components/ui/Login';

type Props = { children: React.ReactNode };

export default function AuthGate({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setAuthed(!!t);
    setReady(true);
  }, []);

  if (!ready) return null; // o un spinner

  if (!authed) return <Login />;

  return <>{children}</>;
}