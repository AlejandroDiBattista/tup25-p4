"use client";
import { useState, useEffect } from "react";
import { obtenerProductos } from "./services/productos";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategorySelect from "./components/CategorySelect";
import ProductoRow from "./components/ProductoRow";
import { Producto } from "./types";
import CartSidebar from "./components/CartSidebar";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    obtenerProductos().then((data: Producto[]) => {
      setProductos(data);
      const cats = Array.from(new Set(data.map((p) => p.categoria).filter(Boolean)));
      setCategorias(cats);
    });
  }, []);

  const onAddToCart = (id: number) => {
    if (typeof window === "undefined") return;
    const carritoRaw = localStorage.getItem("carrito");
    const carrito: { id: number; cantidad: number }[] = carritoRaw ? JSON.parse(carritoRaw) : [];
    const existing = carrito.find((item) => item.id === id);
    if (existing) {
      existing.cantidad += 1;
    } else {
      carrito.push({ id, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria ? producto.categoria === categoria : true;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <Header />
        <div className="mt-10">
          <h1 className="text-2xl font-bold mb-6">Pantalla inicial de productos.</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <SearchBar value={busqueda} onChange={setBusqueda} />
            </div>
            <CategorySelect value={categoria} onChange={setCategoria} categories={categorias} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-4">
              {productosFiltrados.map((producto: Producto) => (
                <ProductoRow key={producto.id} producto={producto} onAdd={onAddToCart} />
              ))}
            </div>
            <CartSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
