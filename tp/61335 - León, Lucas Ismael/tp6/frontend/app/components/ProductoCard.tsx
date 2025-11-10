"use client";
import { Producto } from '../types';
import Image from 'next/image';
import { agregarAlCarrito } from '../services/carrito';
import { useState } from 'react';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [loading, setLoading] = useState(false);
  const agotado = producto.existencia <= 0;

  async function handleAgregar() {
    if (agotado) return;
    try {
      setLoading(true);
      await agregarAlCarrito(producto.id, 1);
      // Simple feedback - en un TP real podríamos usar toast
      alert('Producto agregado al carrito');
    } catch (e: any) {
      alert(e.message || 'Error al agregar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${agotado ? 'opacity-70' : ''}`}>
      <div className="relative h-64 bg-gray-100">
        {agotado && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Agotado
          </span>
        )}
        <Image
          src={`${API_URL}/${producto.imagen}`}
          alt={producto.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4"
          unoptimized
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {producto.titulo}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {producto.descripcion}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {producto.categoria}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-700">{producto.valoracion}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">${producto.precio}</span>
          <span className="text-xs text-gray-500">Stock: {producto.existencia}</span>
        </div>
        <button
          disabled={agotado || loading}
          onClick={handleAgregar}
          className="mt-2 w-full text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded"
        >
          {agotado ? 'No disponible' : loading ? 'Agregando...' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
