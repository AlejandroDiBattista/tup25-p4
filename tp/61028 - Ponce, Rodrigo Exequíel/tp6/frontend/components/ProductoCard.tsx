"use client";

import { Producto } from '../app/types';
import Image from "next/image";
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Badge } from './badge';

// --- 1. IMPORTACIONES NUEVAS ---
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext'; // Para saber si el user está logueado
import { agregarAlCarrito } from '../app/services/carrito'; // El servicio de API
// ---

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  
  // --- 2. HOOKS NUEVOS ---
  const { isLoggedIn, token } = useAuth(); // Obtenemos el estado de auth y el token
  const router = useRouter(); // Para redirigir si no está logueado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ---

  const hayStock = producto.existencia > 0;
  
  const imageId = String(producto.id).padStart(4, '0');
  const imageUrl = `http://localhost:8000/imagenes/${imageId}.png`;

  // --- 3. LÓGICA DEL BOTÓN "AGREGAR AL CARRITO" ---
  const handleAddToCart = async () => {
    setError(null);

    // A. ¿El usuario NO inició sesión?
    if (!isLoggedIn || !token) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      router.push('/login'); // Lo mandamos a la página de login
      return;
    }

    // B. El usuario SÍ inició sesión
    setIsLoading(true);
    try {
      // Llamamos a la API con el ID del producto y el token
      await agregarAlCarrito(
        {
          producto_id: producto.id,
          cantidad: 1, // Por defecto agregamos 1
        },
        token
      );
      
      alert(`¡"${producto.nombre}" fue agregado al carrito!`);
      // (En el futuro, aquí podrías actualizar un contador en el Navbar)

    } catch (err) {
      // Atrapamos el error (ej. "Sin stock") que viene de la API
      if (err instanceof Error) {
        setError(err.message);
        alert(`Error: ${err.message}`); // Mostramos el error
      } else {
        setError("Ocurrió un error desconocido.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // ---

  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={imageUrl}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4"
            unoptimized={true}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {producto.nombre}
        </CardTitle>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {producto.descripcion}
        </p>
         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {producto.categoria}
         </span>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-4">
        <div className="flex justify-between items-center w-full">
            <span className="text-2xl font-bold text-blue-600">
              ${producto.precio.toFixed(2)}
            </span>
            {hayStock ? (
              <Badge variant="default">En Stock ({producto.existencia})</Badge>
            ) : (
              <Badge variant="destructive">Agotado</Badge>
            )}
        </div>
        
        {/* --- 4. BOTÓN MODIFICADO --- */}
        <Button
          className="w-full"
          disabled={!hayStock || isLoading} // Deshabilitado si no hay stock O si está cargando
          onClick={handleAddToCart} // Llama a nuestra nueva función async
        >
          {isLoading 
            ? "Agregando..." // Texto mientras carga
            : (hayStock ? "Agregar al Carrito" : "Sin Stock")
          }
        </Button>

        {/* 5. MUESTRA DE ERRORES (OPCIONAL) */}
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </CardFooter>
    </Card>
  );
}