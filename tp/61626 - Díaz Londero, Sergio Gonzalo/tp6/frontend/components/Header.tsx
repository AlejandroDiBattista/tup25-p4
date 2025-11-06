'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/api';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Verificar si hay token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    setIsAuthenticated(!!token);
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.nombre || userData.email || 'Usuario');
      } catch {
        setUserName('Usuario');
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      // Forzar logout en el cliente aunque falle el servidor
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/auth');
    }
  };

  // No mostrar header en la página de auth
  if (pathname === '/auth' || !isAuthenticated) {
    return null;
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/productos" className="font-bold text-xl">
            TP6 Shop
          </Link>
          
          {/* Enlaces de navegación */}
          <div className="flex items-center gap-8">
            <Link 
              href="/productos" 
              className={`text-sm ${pathname === '/productos' ? 'font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Productos
            </Link>
            
            <Link 
              href="/compras" 
              className={`text-sm ${pathname === '/compras' ? 'font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Mis compras
            </Link>
            
            <span className="text-sm text-muted-foreground">
              {userName}
            </span>
            
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Salir
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
