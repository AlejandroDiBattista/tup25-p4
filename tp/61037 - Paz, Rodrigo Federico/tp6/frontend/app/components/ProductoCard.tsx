"use client";

import { agregarAlCarrito } from "../services/productos";
import { useCarrito } from "../../context/CarritoContext";

export default function ProductoCard({ producto }: any) {
  const { actualizarCarrito } = useCarrito();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const imgSrc = `${API_URL}/imagenes/${producto.id.toString().padStart(4, "0")}.png`;

  const sinStock = producto.existencia <= 0;

  async function handleAdd() {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) return alert("Debe iniciar sesión para agregar al carrito.");
    try {
      await agregarAlCarrito(Number(usuarioId), producto.id);
      actualizarCarrito(); 
    } catch (e: any) {
      alert(e.message || "No se pudo agregar al carrito");
    }
  }

  return (
    <div className="flex gap-4 bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
      <img src={imgSrc} alt={producto.nombre} className="w-32 h-32 object-cover rounded-md" />

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
          <p className="text-sm text-gray-700 mt-1 leading-snug">{producto.descripcion}</p>
          <p className="text-xs text-gray-400 mt-1">Categoría: {producto.categoria}</p>
        </div>
        <p className="text-lg font-semibold text-gray-900">${producto.precio}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="text-gray-700 font-medium">
          {sinStock ? "Agotado" : `Disponible: ${producto.existencia}`}
        </p>

        <button
          disabled={sinStock}
          onClick={handleAdd}
          className={`py-2 px-4 rounded-md text-sm transition ${
            sinStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#0A2540] hover:bg-[#0D3158] text-white"
          }`}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
