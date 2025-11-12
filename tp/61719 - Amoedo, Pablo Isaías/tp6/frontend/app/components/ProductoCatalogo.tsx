"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductoCard from "./ProductoCard";
import { Producto } from "../types"; // ajustá el path si está en otra carpeta

export default function ProductoCatalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/productos");
        setProductos(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {productos.map((producto) => (
        <ProductoCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}