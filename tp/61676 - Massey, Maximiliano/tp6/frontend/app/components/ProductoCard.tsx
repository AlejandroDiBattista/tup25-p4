'use client';

import { Producto } from '../types';
import Image from 'next/image';
import useCartStore from '../store/cart';
import { useState } from 'react';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(producto, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-gray-100">
        <Image
          src={producto.imagen.startsWith('http') ? producto.imagen : `${API_URL}/${producto.imagen}`}
          alt={producto.nombre || producto.titulo || "Imagen del producto"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4"
          unoptimized
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Producto';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {producto.nombre || producto.titulo}
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
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${producto.precio}
          </span>
          <span className="text-xs text-gray-500">
            Stock: {producto.existencia}
          </span>
        </div>
        
        {/* Botón Agregar al Carrito */}
        <button
          onClick={handleAddToCart}
          disabled={producto.existencia === 0}
          className={`w-full py-2 rounded-lg font-semibold transition-colors ${
            producto.existencia === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : added
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {producto.existencia === 0 ? '❌ Agotado' : added ? '✓ Agregado!' : '🛒 Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
}
