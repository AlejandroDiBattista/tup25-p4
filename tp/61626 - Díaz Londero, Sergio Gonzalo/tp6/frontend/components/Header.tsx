'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, LogOut, Store } from 'lucide-react';
import { logout, getCart } from '@/api';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [itemsCount, setItemsCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuthenticated(!!token);

    // Cargar cantidad de items en el carrito
    if (token) {
      loadCartCount();
    }
  }, [pathname]);

  const loadCartCount = async () => {
    try {
      const cart = await getCart();
      const total = cart.items?.reduce((sum: number, item: any) => sum + item.cantidad, 0) || 0;
      setItemsCount(total);
    } catch (error) {
      // Si hay error (ej: carrito vacío), no pasa nada
      setItemsCount(0);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      // Forzar logout en el cliente aunque falle el servidor
      localStorage.removeItem('token');
      router.push('/auth');
    }
  };

  // No mostrar header en la página de auth
  if (pathname === '/auth' || !isAuthenticated) {
    return null;
  }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/productos" className="flex items-center gap-2 font-bold text-xl">
              <Store className="h-6 w-6" />
              <span>TP6 Shop</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="/productos">
                <Button
                  variant={pathname === '/productos' ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <Store className="h-4 w-4" />
                  Productos
                </Button>
              </Link>
              
              <Link href="/carrito">
                <Button
                  variant={pathname === '/carrito' ? 'default' : 'ghost'}
                  className="gap-2 relative"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Carrito
                  {itemsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {itemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Link href="/compras">
                <Button
                  variant={pathname === '/compras' ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  Mis Compras
                </Button>
              </Link>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </nav>
      </div>
    </header>
  );
}
