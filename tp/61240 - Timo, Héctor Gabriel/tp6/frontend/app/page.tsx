"use client";

import { useState, useEffect } from "react";
import { getProductos } from "@/services/api";
import { Producto } from "@/types";
import ProductoCard from "@/components/ProductoCard";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const data = await getProductos(searchQuery, selectedCategory);
      setProductos(data);
    } catch (error) {
      console.error("Error al buscar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const allProducts = await getProductos();
        const uniqueCategories = Array.from(new Set(allProducts.map(p => p.categoria)));
        setCategorias(uniqueCategories);
        setProductos(allProducts);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Efecto para buscar cuando cambian los filtros
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProductos();
    }, 300); // Pequeño delay para no buscar en cada letra que se tipea

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, selectedCategory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna de Productos */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6 text-black">Catálogo de Productos</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-1/2 bg-white text-black"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-1/3 bg-white text-black"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center mt-8">Cargando productos...</p>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="text-center mt-8">No se encontraron productos que coincidan con tu búsqueda.</p>
        )}
      </div>

      {/* Columna del Carrito (Placeholder) */}
      <div className="lg:col-span-1">
        <div className="border rounded-lg p-4 mt-16 text-center bg-white shadow">
          {isAuthenticated ? (
            <p className="text-gray-600">El carrito aparecerá aquí.</p>
          ) : (
            <p className="text-gray-600">Inicia sesión para ver y editar tu carrito.</p>
          )}
        </div>
      </div>
    </div>
  );
}
