"use client";

import {useState} from "react";
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

import { obtenerCarrito } from "@/app/services/carritos";

import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Carrito() {

  const [carrito, setCarrito] = useState(() => {
    return obtenerCarrito();
  });
 
  return (
    <div className="grid gap-8 lg:grid-cols- [minmax(0,2fr)_minmax(0,0fr)]">
      <Card className="w-full max-w-3xl justify-self-center">
        <CardHeader>
          <CardTitle>Tu carrito</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <ScrollArea className="h-80 pr-4">
            <div className="space-y-4">
              {articulosValidos.map((item) => {
                const imagenProducto =
                  item.imagen ?? `${API_URL}/imagenes/placeholder-producto.svg`;

                return (
                  <div
                    key={item.id}
                    className="flex gap-7 rounded-lg border p-4"
                  >
                    <Image
                      src={imagenProducto}
                      alt={item.nombre}
                      width={80}
                      height={80}
                      className="object-contain"
                      unoptimized
                    />
                    <div className="flex flex-1 flex-col gap-2 text-sm">
                      <div className="flex items-start justify-between">
                        <span className="font-semibold">{item.nombre}</span>
                        <span>${item.precio.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => actualizarCantidad(item.id, -1)}
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </Button>
                        <span className="w-6 text-center">{item.cantidad}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => actualizarCantidad(item.id, 1)}
                          disabled={
                            item.stock !== undefined &&
                            item.cantidad >= item.stock
                          }
                        >
                          +
                        </Button>
                      </div>

                      {item.stock !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          Stock disponible: {item.stock - item.cantidad}
                        </span>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Total: ${(item.precio * item.cantidad).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarArticulo(item.id)}
                        >
                          Quitar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {articulosValidos.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  Tu carrito está vacío.
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
          <Button
            className="w-full"
            disabled={articulosValidos.length === 0}
          >
            <Link href="/procesar-pago">Procesar pago</Link>
          </Button>
        </CardFooter>
        
      </Card>
    </div>
  );
}
