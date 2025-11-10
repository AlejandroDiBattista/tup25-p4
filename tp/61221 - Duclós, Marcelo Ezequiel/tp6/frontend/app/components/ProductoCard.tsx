'use client'

import { Producto } from '../types';
import Image from 'next/image';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { agregarProducto } = useCarrito();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [agregado, setAgregado] = useState(false);
  
  const handleAgregarCarrito = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (producto.disponible) {
      agregarProducto(producto);
      setAgregado(true);
      setTimeout(() => setAgregado(false), 2000);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-gray-100">
        <Image
          src={`${API_URL}/${producto.imagen}`}
          alt={producto.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {producto.titulo}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {producto.descripcion}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {producto.categoria}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-700">{producto.valoracion}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${producto.precio}
          </span>
          <div className="text-right">
            <span className={`text-xs ${producto.disponible ? 'text-green-600' : 'text-red-600'}`}>
              {producto.disponible ? `Disponible: ${producto.existencia}` : 'Agotado'}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleAgregarCarrito}
          disabled={!producto.disponible}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            !producto.disponible
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : agregado
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {!producto.disponible 
            ? 'Sin stock' 
            : agregado 
            ? '✓ Agregado' 
            : 'Agregar al carrito'
          }
        </button>
      </div>
    </div>
  );
}
