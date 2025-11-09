"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import {
  obtenerCarrito,
  agregarProductoAlCarrito,
  quitarProductoDelCarrito,
} from "@/app/services/carritos";
import type { Carrito } from "@/app/types";

export default function Carrito() {
  const [items, setItems] = useState<NonNullable<Carrito["productos"]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  async function cargar() {
    try {
      setError(null);
      const carrito = await obtenerCarrito();
      setItems(carrito.productos ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    function refrescar() {
      cargar();
    }
    window.addEventListener("cart:changed", refrescar);
    return () => window.removeEventListener("cart:changed", refrescar);
  }, []);

  async function actualizarCantidad(producto_id: number, delta: number) {
    try {
      const itemActual = items.find((i) => i.producto_id === producto_id);
      if (!itemActual) return;

      // Validar stock para incremento
      if (
        delta > 0 &&
        typeof itemActual.existencia === "number" &&
        itemActual.cantidad >= itemActual.existencia
      ) {
        setError("No hay stock suficiente para agregar más unidades.");
        return;
      }

      // Operación
      if (delta < 0 && itemActual.cantidad <= 1) {
        await quitarProductoDelCarrito(producto_id);
        // Optimista: remover inmediatamente
        setItems((prev) => prev.filter((p) => p.producto_id !== producto_id));
      } else {
        await agregarProductoAlCarrito(producto_id, delta);
        // Optimista: ajustar cantidad local
        setItems((prev) =>
          prev.map((p) =>
            p.producto_id === producto_id
              ? { ...p, cantidad: p.cantidad + delta }
              : p
          )
        );
      }
      window.dispatchEvent(new CustomEvent("cart:changed"));
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Error al actualizar");
    }
  }

  async function eliminarArticulo(producto_id: number) {
    try {
      await quitarProductoDelCarrito(producto_id);
      setItems((prev) => prev.filter((p) => p.producto_id !== producto_id));
      window.dispatchEvent(new CustomEvent("cart:changed"));
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  }

  const articulosValidos = items ?? [];
  const subtotal = articulosValidos.reduce(
    (acc, it) => acc + (it.subtotal ?? it.precio * it.cantidad),
    0
  );
  // IVA por categoría si viene en el item, si no 21% por defecto
  const iva = articulosValidos.reduce((acc, it) => {
    const cat = (it as { categoria?: string }).categoria?.toLowerCase() ?? "";
    const esElectronico = cat.includes("electr");
    const tasa = esElectronico ? 0.1 : 0.21;
    return acc + it.precio * it.cantidad * tasa;
  }, 0);
  // Envío gratis si subtotal+iva supera 1000 (coincide con backend), sino 50
  const envio = subtotal + iva > 1000 ? 0 : 50;
  const total = subtotal + iva + envio;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,0fr)]">
      <Card className="w-full max-w-3xl justify-self-center">
        <CardHeader>
          <CardTitle>Tu carrito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="h-80 pr-4">
            <div className="space-y-4">
              {articulosValidos.map((item) => (
                <div
                  key={item.producto_id}
                  className="flex gap-7 rounded-lg border p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-muted/50">
                    <Image
                      src={
                        item.imagen
                          ? item.imagen.startsWith("http")
                            ? item.imagen
                            : `${API_URL}/${item.imagen.replace(/^\//, "")}`
                          : `${API_URL}/imagenes/placeholder-producto.svg`
                      }
                      alt={item.nombre}
                      fill
                      className="object-contain"
                      sizes="80px"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 text-sm">
                    <div className="flex items-start justify-between">
                      <span className="font-semibold">{item.nombre}</span>
                      <span>${item.precio.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => actualizarCantidad(item.producto_id, -1)}
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center">{item.cantidad}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => actualizarCantidad(item.producto_id, 1)}
                        disabled={
                          typeof item.existencia === "number" &&
                          item.cantidad >= item.existencia
                        }
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Total: $
                        {(item.subtotal ?? item.precio * item.cantidad).toFixed(
                          2
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarArticulo(item.producto_id)}
                      >
                        Quitar
                      </Button>
                    </div>
                    {typeof item.existencia === "number" && (
                      <span className="text-xs text-muted-foreground">
                        Stock disponible:{" "}
                        {Math.max(item.existencia - item.cantidad, 0)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {!loading && articulosValidos.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  Tu carrito está vacío.
                </div>
              )}
              {loading && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Cargando carrito...
                </div>
              )}
              {error && (
                <div className="p-4 text-center text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </ScrollArea>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA</span>
              <span className="font-semibold">${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="font-semibold">${envio.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={articulosValidos.length === 0}>
            <Link href="/procesar-pago">Procesar pago</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
