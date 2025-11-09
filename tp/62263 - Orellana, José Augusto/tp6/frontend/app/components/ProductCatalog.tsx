'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import ProductoCard from './ProductoCard';
import { Producto } from '../types';

interface ProductCatalogProps {
  productos: Producto[];
}

const TODAS = 'Todas las categorías';

export default function ProductCatalog({ productos }: ProductCatalogProps) {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(TODAS);

  const categorias = useMemo(() => {
    const unicas = new Set(productos.map((producto) => producto.categoria));
    return [TODAS, ...Array.from(unicas).sort((a, b) => a.localeCompare(b))];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaSeleccionada === TODAS || producto.categoria === categoriaSeleccionada;

      const coincideBusqueda =
        termino.length === 0 ||
        producto.titulo.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino);

      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoriaSeleccionada, productos]);

  const carritoCard = (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
      Inicia sesión para ver y editar tu carrito.
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-600 shadow-sm transition focus:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-200"
          />
        </div>

        <div className="relative w-full lg:w-64">
          <select
            value={categoriaSeleccionada}
            onChange={(event) => setCategoriaSeleccionada(event.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-600 shadow-sm transition focus:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {productosFiltrados.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No se encontraron productos que coincidan con la búsqueda.
            </div>
          ) : (
            productosFiltrados.map((producto) => <ProductoCard key={producto.id} producto={producto} />)
          )}
        </div>

        <aside className="hidden h-fit lg:block">{carritoCard}</aside>
      </div>

      <div className="lg:hidden">{carritoCard}</div>
    </section>
  );
}
