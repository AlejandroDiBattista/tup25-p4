'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { obtenerProductos } from './services/productos';
import { useCarrito } from './hooks/useCarrito';
import { useAuth } from './context/AuthContext';
import { Producto } from './types';

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState<string>('todas');
  const [categorias, setCategorias] = useState<string[]>([]);

  const { agregar } = useCarrito();
  const { isAuthenticated, logout } = useAuth();

  // Cargar categorías al inicio
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    cargarProductos();
  }, [searchTerm, categoria]);

  const cargarCategorias = async () => {
    try {
      // Cargar todos los productos para extraer categorías únicas
      const data = await obtenerProductos();
      const categoriasUnicas = [...new Set(data.map(p => p.categoria))];
      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const filtros = {
        buscar: searchTerm || undefined,
        categoria: categoria !== 'todas' ? categoria : undefined,
      };
      const data = await obtenerProductos(filtros);
      setProductos(data);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (producto: Producto) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      await agregar(producto.id, 1);
      toast.success(`${producto.titulo} agregado al carrito`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al agregar al carrito';
      
      // Si el error es de sesión expirada, cerrar sesión automáticamente
      if (message.includes('sesión ha expirado') || message.includes('token')) {
        toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        await logout();
      } else {
        toast.error(message);
      }
    }
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setCategoria('todas');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">
            Descubre nuestra selección de productos
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selector de categoría */}
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botón limpiar filtros */}
            {(searchTerm || categoria !== 'todas') && (
              <Button variant="outline" onClick={limpiarFiltros}>
                <X className="mr-2 h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          // Skeleton de carga
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : productos.length > 0 ? (
          <>
            {/* Contador de resultados */}
            <p className="text-sm text-gray-600 mb-4">
              {productos.length} {productos.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        ) : (
          // Sin resultados
          <Alert>
            <AlertDescription>
              No se encontraron productos con los filtros seleccionados.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
