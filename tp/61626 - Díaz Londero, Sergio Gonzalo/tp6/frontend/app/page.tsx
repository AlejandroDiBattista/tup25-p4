'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay token
    const token = localStorage.getItem('token');
    
    if (token) {
      // Si está autenticado, ir a productos
      router.push('/productos');
    } else {
      // Si no está autenticado, ir a auth
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-muted-foreground">Redirigiendo...</div>
    </div>
  );
}
