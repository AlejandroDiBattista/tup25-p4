'use client';

import { useEffect, useMemo, useState } from 'react';
import { obtenerProductos } from '../services/productos';
import type { Producto } from '../types';
import ProductoListItem from './ProductoListItem';

export default function ProductosBrowser() {
const [productos, setProductos] = useState<Producto[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('');
const [categoria, setCategoria] = useState<'todas' | string>('todas');

useEffect(() => {
        let cancelado = false;

        async function fetchData() {
        setLoading(true);
        try {
            const data = await obtenerProductos({
            search: search.trim() || undefined,
            categoria: categoria === 'todas' ? undefined : categoria,
            });
            if (!cancelado) setProductos(data);
        } finally {
            if (!cancelado) setLoading(false);
        }
        }

        const t = setTimeout(fetchData, 250);
        return () => {
        cancelado = true;
        clearTimeout(t);
        };
    }, [search, categoria]);

    const categorias = useMemo(() => {
        const set = new Set<string>(productos.map(p => p.categoria));
        return ['todas', ...Array.from(set)];
    }, [productos]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Barra de filtros */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px] mb-4">
            <div className="relative">
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar…"
                className="w-full rounded-md border border-gray-300 bg-white px-10 py-2 outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-500"
            />
            <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                viewBox="0 0 20 20" fill="currentColor"
            >
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd" />
            </svg>
            </div>

            <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
            >
                {categorias.map(c => (
                <option key={c} value={c}>
                    {c === 'todas' ? 'Todas las categorías' : c}
                </option>
                ))}
            </select>
        </div>

        {/* Layout principal: lista + sidebar */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Lista */}
            <div className="space-y-4">
            {loading ? (
                <p className="text-gray-500">Cargando productos…</p>
            ) : productos.length === 0 ? (
                <p className="text-gray-500">No se encontraron productos.</p>
            ) : (
                productos.map((p) => <ProductoListItem key={p.id} producto={p} />)
            )}
            </div>

            {/* Sidebar (placeholder de carrito no logueado) */}
            <aside className="hidden lg:block">
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
                Inicia sesión para ver y editar tu carrito.
            </div>
            </aside>
        </div>
        </div>
    );
}
