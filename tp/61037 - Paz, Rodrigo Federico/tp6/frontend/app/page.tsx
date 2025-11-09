"use client";

import { useState, useEffect } from "react";
import { obtenerProductos, obtenerCarrito } from "./services/productos";
import ProductoCard from "./components/ProductoCard";
import Carrito from "./components/Carrito";

export default function Home() {
  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const id = Number(localStorage.getItem("usuario_id"));
    setUsuarioId(id || null);
  }, []);

  useEffect(() => {
    let url = `/productos`;

    const params = new URLSearchParams();
    if (busqueda.trim()) params.append("q", busqueda.trim());
    if (categoria !== "todas") params.append("categoria", categoria);

    if (params.toString()) url += `?${params.toString()}`;

    fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + url)
      .then((res) => res.json())
      .then((data) => setProductos(data));
  }, [busqueda, categoria]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de Productos
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-4 gap-6">

        <div className="col-span-4 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-2/3 border px-3 py-2 rounded"
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="todas">Todas las categorías</option>
            <option value="Ropa de hombre">Ropa de hombre</option>
            <option value="Ropa de mujer">Ropa de mujer</option>
            <option value="Joyería">Joyería</option>
            <option value="Electrónica">Electrónica</option>
          </select>
        </div>

        <div className="col-span-3 space-y-4">
  {productos.map((producto) => (
    <ProductoCard key={producto.id} producto={producto} />
  ))}
</div>

        <div className="col-span-1">
          <Carrito />
        </div>

      </main>
    </div>
  );
}
