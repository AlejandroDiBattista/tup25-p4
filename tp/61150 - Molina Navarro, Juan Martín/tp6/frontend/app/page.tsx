"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ProductoCard from "./components/ProductoCard";
import type { Producto } from "./types";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type LoadState = "idle" | "loading" | "error";

export default function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [estadoCarga, setEstadoCarga] = useState<LoadState>("idle");
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [token, setToken] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const obtenerProductos = async () => {
      setEstadoCarga("loading");
      try {
        const response = await fetch(`${API_BASE_URL}/productos`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("No se pudieron cargar los productos");
        }
        const data = await response.json();
        setProductos(data);
        setEstadoCarga("idle");
      } catch (error) {
        console.error(error);
        setEstadoCarga("error");
      }
    };

    obtenerProductos();
  }, []);

  const categorias = useMemo(() => {
    const unique = Array.from(
      new Set(productos.map((producto) => producto.categoria))
    ).sort();
    return ["todas", ...unique];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const termino = search.trim().toLowerCase();
    return productos.filter((producto) => {
      const coincideCategoria =
        categoria === "todas" ||
        producto.categoria.toLowerCase() === categoria.toLowerCase();
      const coincideBusqueda =
        termino.length === 0 ||
        `${producto.titulo} ${producto.descripcion}`
          .toLowerCase()
          .includes(termino);
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, search, categoria]);

  const handleAgregarAlCarrito = async (productoId: number) => {
    if (!token) {
      setMensaje("Inicia sesion para agregar productos al carrito.");
      return;
    }

    setAddingId(productoId);
    setMensaje(null);
    try {
      const response = await fetch(`${API_BASE_URL}/carrito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ producto_id: productoId, cantidad: 1 }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail ?? "No se pudo agregar el producto");
      }
      setMensaje("Producto agregado al carrito.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ocurrio un error inesperado";
      setMensaje(message);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <SiteHeader active="products" />
      <main className="mx-auto flex w-full max-w-6xl gap-6 px-6 py-10">
        <section className="flex-1 space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 013.863 9.409l3.114 3.114a.75.75 0 11-1.06 1.06l-3.114-3.114A5.5 5.5 0 119 3.5zm0 1.5a4 4 0 100 8 4 4 0 000-8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <Input
                placeholder="Buscar..."
                className="h-12 rounded-2xl border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div>
              <select
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm lg:w-56"
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "todas"
                      ? "Todas las categorias"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {estadoCarga === "loading" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                Cargando productos...
              </div>
            )}
            {estadoCarga === "error" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                Error al cargar los productos. Intenta nuevamente mas tarde.
              </div>
            )}
            {estadoCarga === "idle" && productosFiltrados.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                No encontramos productos que coincidan con tu busqueda.
              </div>
            )}
            {productosFiltrados.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onAdd={() => handleAgregarAlCarrito(producto.id)}
                disabled={
                  producto.existencia === 0 || addingId === producto.id
                }
                loading={addingId === producto.id}
              />
            ))}
          </div>
        </section>

        <aside className="hidden w-72 flex-shrink-0 lg:block">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              {token
                ? "Selecciona un producto para agregarlo a tu carrito."
                : "Inicia sesion para ver y editar tu carrito."}
            </p>
            {mensaje && (
              <p
                className={cn(
                  "mt-4 rounded-xl px-4 py-3 text-sm",
                  mensaje.includes("agregado")
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {mensaje}
              </p>
            )}
            {!token && (
              <Button
                asChild
                className="mt-6 w-full rounded-full bg-slate-900 py-2 text-sm text-white hover:bg-slate-800"
              >
                <Link href="/login">Iniciar sesion</Link>
              </Button>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
