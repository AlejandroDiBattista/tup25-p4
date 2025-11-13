"use client";
import { Producto } from "@/app/types";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const { add } = useCart();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const puedeComprar = (producto.existencia ?? 0) > 0;
  const handleAdd = async () => {
    if (!puedeComprar) return;
    try {
      setAdding(true);
      await add(producto.id, 1);
    } catch (e: any) {
      const msg = (e?.message || "").toLowerCase();
      if (msg.includes("autentic")) {
        // Mostrar mensaje en esquina inferior derecha sin redirigir
        toast("Falta iniciar sesión");
      } else {
        // eslint-disable-next-line no-console
        console.error(e);
        toast("No se pudo agregar al carrito");
      }
    } finally {
      setAdding(false);
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
        <div className="flex justify-between items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">${producto.precio}</span>
          <span className={`text-xs ${puedeComprar ? 'text-gray-500' : 'text-red-600'}`}>
            {puedeComprar ? `Stock: ${producto.existencia}` : 'Agotado'}
          </span>
        </div>
        <button
          onClick={handleAdd}
          disabled={!puedeComprar || adding}
          className="mt-3 w-full bg-indigo-600 text-white rounded py-2 text-sm disabled:opacity-50"
        >
          {adding ? 'Agregando...' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
