"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductoCard from "./ProductoCard";
import type { Producto } from "@/app/types";

interface BarraDeBusquedaProps {
  productos: Producto[];
  titulo?: string;
  texto?: string; // modo controlado: valor de búsqueda desde el padre
  onCambiarTexto?: (valor: string) => void; // callback al cambiar
}

export default function BarraDeBusqueda({ productos, titulo = "Catálogo de Productos", texto, onCambiarTexto }: BarraDeBusquedaProps) {
  const [textoLocal, setTextoLocal] = useState(texto ?? "");

  // Si el padre controla "texto", sincronizamos el local cuando cambie
  useEffect(() => {
    if (texto !== undefined) {
      setTextoLocal(texto);
    }
  }, [texto]);

  const textoActual = texto !== undefined ? texto : textoLocal;
  const handleChange = (valor: string) => {
    if (onCambiarTexto) onCambiarTexto(valor);
    else setTextoLocal(valor);
  };

  const filtrados = useMemo(() => {
    const q = textoActual.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) =>
      p.titulo.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  }, [productos, textoActual]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{titulo}</h1>
            <div className="w-full md:w-96">
              <Label htmlFor="barra-busqueda" className="sr-only">Barra de búsqueda</Label>
              <div className="relative">
                <Input
                  id="barra-busqueda"
                  value={textoActual}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Buscar por título, descripción o categoría..."
                  className="pr-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.957l3.775 3.775a.75.75 0 1 0 1.06-1.06l-3.775-3.775A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{filtrados.length} productos disponibles</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {filtrados.length === 0 ? (
          <p className="text-gray-500">No se encontraron productos para "{textoActual}".</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
