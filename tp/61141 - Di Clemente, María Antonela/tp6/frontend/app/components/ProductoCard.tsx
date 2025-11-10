"use client";

import { Producto } from '../types';
import Image from 'next/image';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto, onAgregar }: ProductoCardProps & { onAgregar?: (producto: any) => void }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
 return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex items-start gap-4 p-4">
      <div className="relative w-40 h-40 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={`${API_URL}/${producto.imagen}`}
          alt={producto.titulo}
          fill
          sizes="160px"
          className="object-contain p-2"
          unoptimized
        />
      </div>

       {/* Contenedor principal */}
      <div className="flex justify-between w-full">
        <div className="flex-1 pr-4">

          <div className="flex-1">
           {/* Título */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
             {producto.titulo}
            </h3>
          </div>  

          {/* Descripción */}
          <p className="text-sm text-gray-600 mb-2">{producto.descripcion}</p>

          {/* Valoración */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="text-sm text-gray-700">{producto.valoracion}</span>
          </div>

          {/* Categoría */}
          <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
            {producto.categoria}
          </p>
        </div>

        {/* Precio, stock y botón */}
        <div className="flex flex-col items-end justify-start">
          <span className="text-xl font-bold text-black mb-1">
            ${producto.precio}
          </span>
          <span className="text-xs text-gray-500 mb-2">
            Stock disponible: {producto.existencia}
          </span>

        {/* Botón Agregar al carrito */}
        <button
          onClick={() => onAgregar?.(producto)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors mt-3"
        >
          Agregar al carrito
        </button>
        </div>
      </div>
    </div>
  );
}