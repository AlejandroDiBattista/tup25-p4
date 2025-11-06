"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useCarritoStore } from "@/store/useCarritoStore";

import Image from "next/image";

export default function Carrito() {
  const { actualizarCantidad, eliminarArticulo, limpiar, articulos } =
    useCarritoStore();

    
  const articulosValidos = articulos.filter(
    (item): item is NonNullable<typeof item> => !!item
  );
  const subtotal = articulosValidos.reduce(
    (acumulado, item) => acumulado + item.precio * item.cantidad,
    0
  );

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Tu carrito</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-4">
            {articulosValidos.map((item) => {
              const imagenProducto = item.imagen ?? "/placeholder-producto.svg";
              return (
                <div key={item.id} className="flex gap-4 rounded-lg border p-4">
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
                      >
                        +
                      </Button>
                    </div>

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
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <Button className="w-full" disabled={articulosValidos.length === 0}>
          Proceder al pago
        </Button>
      </CardFooter>
    </Card>
  );
}
