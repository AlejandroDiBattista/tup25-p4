'use client';

import { Producto } from '../types';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const { agregarAlCarrito } = useCarrito();
  const { token } = useAuth();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleAgregarAlCarrito = () => {
    if (!token) {
      router.push('/auth');
      return;
    }
    agregarAlCarrito(producto.id, 1);
   
  };

  return (
    <div className="bg-white border border-gray-200 overflow-hidden hover:border-black transition-colors flex flex-col group">
      <div className="relative h-64 bg-gray-50 overflow-hidden">
        <img
          src={`${API_URL}/${producto.imagen}`}
          alt={producto.titulo}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=' + producto.titulo;
          }}
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-normal text-black mb-2 line-clamp-2">
          {producto.titulo}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 font-light">
          {producto.descripcion}
        </p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {producto.categoria}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-black">★</span>
            <span className="text-sm text-gray-700">{producto.valoracion}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4 mt-auto">
          <span className="text-xl font-light text-black">
            ${producto.precio}
          </span>
          <span className="text-xs text-gray-400">
            Stock: {producto.existencia}
          </span>
        </div>
        <button
          onClick={handleAgregarAlCarrito}
          disabled={producto.existencia === 0}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-normal py-2.5 px-4 transition-colors text-sm uppercase tracking-wider"
        >
          {producto.existencia === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
