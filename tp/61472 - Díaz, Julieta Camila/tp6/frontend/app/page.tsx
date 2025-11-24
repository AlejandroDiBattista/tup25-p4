"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import { useCart } from "../src/context/CartContext";

export default function ProductosPage() {
  const { user, token } = useAuth();
  const { addToCart } = useCart();

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);

  // Cargar productos desde backend
  const cargarProductos = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/productos`;

      const params = [];

      if (busqueda) params.push(`busqueda=${busqueda}`);
      if (categoria) params.push(`categoria=${categoria}`);

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setProductos(data);

      // categorías únicas
      const cats = [...new Set(data.map((p: any) => p.categoria))];
      setCategorias(cats);
    } catch (error) {
      console.log("Error cargando productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [busqueda, categoria]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Productos</h1>

      {/* Buscador + Categoría */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full px-4 py-2 border rounded-md bg-white shadow-sm"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-md bg-white shadow-sm"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Mensaje si no está logueado */}
      {!user && (
        <div className="w-full p-4 border rounded-md bg-white text-center text-sm text-slate-600 shadow-sm">
          Inicia sesión para ver y editar tu carrito.
        </div>
      )}

      {/* Lista de productos */}
      <div className="space-y-4">
        {productos.map((prod: any) => (
          <div
            key={prod.id}
            className="flex bg-white border rounded-lg p-4 shadow-sm"
          >
            {/* Imagen */}
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/${prod.imagen}`}
              alt={prod.titulo}
              className="w-32 h-32 object-cover rounded-md border"
            />

            <div className="flex-1 px-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{prod.titulo}</h3>
                <p className="text-sm text-slate-600">{prod.descripcion}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Categoría: {prod.categoria}
                </p>
              </div>
            </div>

            {/* Precio / botón */}
            <div className="flex flex-col justify-between items-end">
              <p className="text-lg font-semibold">${prod.precio}</p>
              <p className="text-sm text-slate-600">
                Disponible: {prod.existencia}
              </p>

              {user ? (
                <button
                  onClick={() => addToCart(prod.id)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-700"
                >
                  Agregar al carrito
                </button>
              ) : (
                <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm cursor-not-allowed">
                  Agregar al carrito
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}