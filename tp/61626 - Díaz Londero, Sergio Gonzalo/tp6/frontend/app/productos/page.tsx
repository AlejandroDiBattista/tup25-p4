'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts, addToCart } from '@/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  existencia: number;
  imagen?: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoria, setCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    cargarProductos();
  }, [categoria, busqueda, router]);

  const cargarProductos = async () => {
    try {
      const data = await getProducts(categoria, busqueda);
      setProductos(data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los productos');
      setLoading(false);
    }
  };

  const handleAddToCart = async (productoId: number) => {
    try {
      await addToCart(productoId, 1);
      alert('Producto agregado al carrito');
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-muted-foreground">Cargando productos...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-destructive">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtros */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              <SelectItem value="Ropa de hombre">Ropa de hombre</SelectItem>
              <SelectItem value="electrónicos">Electrónicos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grilla de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <Card key={producto.id} className="flex flex-col">
            <CardHeader>
              {/* Imagen del producto */}
              <div className="relative w-full aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                {producto.imagen ? (
                  <Image
                    src={`http://localhost:8000/imagenes/${producto.imagen}`}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">Sin imagen</span>
                )}
              </div>
              <CardTitle className="line-clamp-1">{producto.nombre}</CardTitle>
              <CardDescription className="line-clamp-2">
                {producto.descripcion}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {producto.categoria}
                </Badge>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">${producto.precio.toFixed(2)}</span>
                  <Badge variant={producto.existencia > 0 ? "default" : "destructive"}>
                    {producto.existencia > 0 ? `Stock: ${producto.existencia}` : 'Agotado'}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleAddToCart(producto.id)}
                disabled={producto.existencia === 0}
                className="w-full"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {producto.existencia > 0 ? 'Agregar al carrito' : 'Sin stock'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {productos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
}