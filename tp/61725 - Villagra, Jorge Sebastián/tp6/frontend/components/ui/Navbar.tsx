'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setToken(localStorage.getItem('token'));
    setNombre(localStorage.getItem('usuario_nombre'));
  }, []);

  async function logout() {
    try {
      const t = localStorage.getItem('token');
      if (t) {
        await fetch(`${API_URL}/cerrar-sesion`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${t}` },
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario_nombre');
      setToken(null);
      setNombre(null);
      toast.success('Sesión cerrada', { duration: 1200 });
      router.push('/auth/login');
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold hover:opacity-80">
            Mi Tienda
          </Link>
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Productos</Link>
            <Link href="/compras" className="hover:text-foreground">Mis compras</Link>
            <Link href="/carrito" className="hover:text-foreground">Carrito</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {token ? (
            <>
              {nombre && (
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  Hola, {nombre}
                </span>
              )}
              <Button variant="secondary" size="sm" onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => router.push('/auth/login')}>
              Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}