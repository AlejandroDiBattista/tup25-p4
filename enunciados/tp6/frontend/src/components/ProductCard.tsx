'use client';

import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import LoginModal from './LoginModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string | number;
  nombre: string;
  precio: number;
  imagen?: string;
  disponible?: number;
  descripcion?: string;
}

export function ProductCard({ producto }: { producto: Product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    addToCart({
      id: producto.id,
      name: producto.nombre,
      price: producto.precio,
      quantity,
      image: producto.imagen,
    });
    setQuantity(1);
    alert('Producto agregado al carrito');
  };

  const disponible = producto.disponible || 5;
  const imageUrl = producto.imagen 
    ? (producto.imagen.startsWith('http') ? producto.imagen : `/productos/${producto.imagen}`)
    : '/placeholder.png';

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="w-full h-56 bg-gray-200 overflow-hidden">
          <img
            src={imageUrl}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{producto.nombre}</h3>
          <p className="text-gray-600 mb-2 text-sm line-clamp-2">{producto.descripcion}</p>
          <p className="text-gray-600 mb-3">${producto.precio}</p>
          <p className="text-sm text-gray-500 mb-3">Disponible: {disponible}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                −
              </button>
              <span className="flex-1 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(disponible, quantity + 1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
}