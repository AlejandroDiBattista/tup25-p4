import Image from "next/image";
import { Producto } from "../types";

interface ProductoRowProps {
  producto: Producto;
  onAdd: (id: number) => void;
  isLogged?: boolean;
}

export default function ProductoRow({ producto, onAdd, isLogged = false }: ProductoRowProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const agotado = producto.existencia <= 0;

  return (
    <div className="flex items-start justify-between bg-white border rounded-md p-4 shadow-sm">
      {/* Izquierda: imagen + datos */}
      <div className="flex gap-4">
        <div className="relative w-28 h-28 bg-gray-100 rounded overflow-hidden">
          <Image
            src={`${API_URL}/${producto.imagen}`}
            alt={producto.titulo}
            fill
            className="object-contain"
            sizes="112px"
            unoptimized
          />
        </div>
        <div className="max-w-xl">
          <h3 className="font-semibold text-gray-900 leading-5">{producto.titulo}</h3>
          <p className="text-sm text-gray-800 mt-1 line-clamp-2">{producto.descripcion}</p>
          <div className="text-xs text-gray-800 mt-2">Categoría: {producto.categoria}</div>
        </div>
      </div>

      {/* Derecha: precio, stock y botón */}
      <div className="flex flex-col items-end gap-3 min-w-[180px]">
        <div className="text-gray-900 font-semibold">${producto.precio.toFixed(2)}</div>
        <div className="text-xs text-gray-900">Disponible: {producto.existencia}</div>
        <button
          className={`px-4 py-2 rounded text-sm font-semibold transition ${
            agotado || !isLogged
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          onClick={() => !agotado && isLogged && onAdd(producto.id)}
          disabled={agotado || !isLogged}
        >
          {agotado ? "Agotado" : isLogged ? "Agregar al carrito" : "Ingresá para comprar"}
        </button>
      </div>
    </div>
  );
}
