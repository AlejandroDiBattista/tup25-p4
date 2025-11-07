'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setAuthed(!!t);
    setReady(true);
    if (!t) router.replace('/auth/login');
  }, [router]);

  // Mientras carga, devolver un contenedor estable (sin null) para evitar mismatch
  if (!ready) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-muted-foreground">Cargando…</div>;
  }

  if (!authed) {
    // Ya se hará redirect; devolvemos markup estable
    return <div className="max-w-7xl mx-auto px-4 py-8 text-sm">Redirigiendo…</div>;
  }

  return <>{children}</>;
}