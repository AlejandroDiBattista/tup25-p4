import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
"use client";
import { useEffect, useState } from "react";
import ProductoCard from "./components/ProductoCard";
import { getProductos } from "./services/productos";
import { Product } from "./types";

export default async function Home() {
  const productos = await obtenerProductos();
export default function Page() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [q, setQ] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600 mt-2">
            {productos.length} productos disponibles
          </p>
        </div>
      </header>
  useEffect(() => {
    (async () => {
      const res = await getProductos();
      setProductos(res || []);
    })();
  }, []);

  const filtered = productos.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()) || (p.descripcion ?? "").toLowerCase().includes(q.toLowerCase()));

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      </main>
  return (
    <div>
      <div className="mb-4 flex">
        <input value={q} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} placeholder="Buscar..." className="border p-2 rounded w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p: Product) => <ProductoCard key={p.id} producto={p} />)}
      </div>
    </div>
  );
}
