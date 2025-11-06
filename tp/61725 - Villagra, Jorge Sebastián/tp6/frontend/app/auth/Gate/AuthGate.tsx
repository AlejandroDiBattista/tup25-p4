'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) router.replace('/auth/login');
  }, [router]);

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
  if (!hasToken) return null; // o spinner

  return <>{children}</>;
}