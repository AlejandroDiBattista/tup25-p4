'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Componente de barra de navegación principal
 * Muestra logo, navegación, carrito y opciones de usuario
 */
export default function NavBar() {
  // TODO: Conectar con estado global en próximo commit
  const isAuthenticated = false;
  const cartItemsCount = 0;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center gap-8">
            <Link href="/products" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                E-Commerce
              </span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Productos
                </Link>
                <Link 
                  href="/purchases" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Mis Compras
                </Link>
              </div>
            )}
          </div>

          {/* Acciones de usuario */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Carrito */}
                <Link href="/cart">
                  <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Perfil */}
                <Link href="/purchases">
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Cerrar sesión */}
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button>
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
