import { Producto } from '../types';
import Image from 'next/image';
"use client";
import { Product } from "../types";
import { addToCart } from "../services/cart";
import { getToken } from "../services/auth";
import { useState } from "react";

interface ProductoCardProps {
  producto: Producto;
}
export default function ProductoCard({ producto }: { producto: Product }) {
  const agotado = producto.existencia <= 0;
  const [loading, setLoading] = useState(false);

  async function handleAgregar() {
    if (agotado) return;
    setLoading(true);
    try {
      const res = await addToCart(producto.id, 1);
      if (res.ok) {
        alert("Producto agregado al carrito");
      } else {
        if (res.status === 401) {
          alert("Debes iniciar sesión para agregar al carrito");
        } else {
          const text = await res.text();
          alert("Error: " + text);
        }
      }
    } catch (e) {
      alert("Error al agregar al carrito");
    } finally {
      setLoading(false);
    }
  }

export default function ProductoCard({ producto }: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-gray-100">
        <Image
          src={`${API_URL}/${producto.imagen}`}
          alt={producto.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4"
          unoptimized
        />
    <div className="bg-white p-4 rounded shadow">
      <div className="h-48 flex items-center justify-center mb-4">
        {producto.imagen ? (
          <img src={`${process.env.NEXT_PUBLIC_API_URL || ""}/imagenes/${producto.imagen}`} alt={producto.nombre} className="max-h-full" />
        ) : (
          <div className="text-gray-400">Sin imagen</div>
        )}
      </div>
      <h3 className="font-semibold">{producto.nombre}</h3>
      <p className="text-sm text-gray-600">{producto.descripcion}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold">${producto.precio.toFixed(2)}</span>
        {agotado ? <span className="text-red-500">Agotado</span> : <span className="text-green-600">Stock: {producto.existencia}</span>}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {producto.titulo}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {producto.descripcion}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {producto.categoria}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-700">{producto.valoracion}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${producto.precio}
          </span>
          <span className="text-xs text-gray-500">
            Stock: {producto.existencia}
          </span>
        </div>
      <div className="mt-3">
        <button onClick={handleAgregar} disabled={agotado || loading} className={`px-3 py-1 rounded ${agotado ? "bg-gray-300" : "bg-blue-600 text-white"}`}>
          {loading ? "..." : "Agregar"}
        </button>
      </div>
    </div>
  );
}
