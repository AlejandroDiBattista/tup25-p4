"use client";
import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productos";
import ProductoCard from "../components/ProductoCard";
import { useAuth } from "../hooks/useAuth";
import { Producto } from "../types";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    obtenerProductos()
      .then(setProductos)
      .catch((err) => setError(err.message));
  }, []);

  return (
  <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      {!isAuthenticated && (
        <div className="bg-blue-100 text-blue-700 p-2 rounded mb-4">
          Inicia sesión para ver y editar tu carrito.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto: any) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}
