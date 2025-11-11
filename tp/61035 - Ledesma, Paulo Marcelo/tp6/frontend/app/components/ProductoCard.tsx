'use client';
import { Producto } from '../types';
import Image from 'next/image';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAgregarAlCarrito = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/carrito/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          producto_id: producto.id,
          cantidad: 1,
        }),
      });

      if (!res.ok) throw new Error('Error al agregar producto al carrito');
      alert(`✅ ${producto.titulo} agregado al carrito`);
    } catch (error) {
      console.error(error);
      alert('❌ No se pudo agregar al carrito');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
        {/* Imagen del producto */}
        <div className="relative h-64 bg-gray-100">
          <Image
            src={`${API_URL}/${producto.imagen}`}
            alt={`Imagen del producto ${producto.titulo}`}  
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4"
            unoptimized
          />
        </div>

        {/* Información del producto */}
        <div className="p-4 flex flex-col flex-grow">
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
            <span className="text-xs text-gray-500">
              Stock: {producto.existencia}
            </span>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAgregarAlCarrito}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            🛒 Agregar al carrito
          </button>
        </div>
      </div>

      {/* Modal de autenticación si no hay sesión */}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
