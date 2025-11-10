"use client";
import { useState, useEffect } from "react";
import { obtenerProductos } from "./services/productos";
import ProductoCard from "./components/ProductoCard";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategorySelect from "./components/CategorySelect";
import { Producto } from "./types";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    obtenerProductos().then((data: Producto[]) => {
      setProductos(data);
      setCategorias([
        ...new Set(data.map((p: Producto) => p.categoria).filter(Boolean)),
      ]);
    });
  }, []);

  const productosFiltrados = productos.filter((p: Producto) => {
    const matchBusqueda =
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoria ? p.categoria === categoria : true;
    return matchBusqueda && matchCategoria;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="flex-1 w-full">
            <SearchBar value={busqueda} onChange={setBusqueda} />
          </div>
          <CategorySelect value={categoria} onChange={setCategoria} categories={categorias} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((producto: Producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      </main>
    </div>
  );
}
