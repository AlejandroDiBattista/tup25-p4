"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Producto } from "../app/types";

import { useCarritoStore } from "@/store/useCarritoStore";

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {

  const agregarArticulo = useCarritoStore((art) => art.agregarArticulo);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const formatearPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  const relativePath = producto.imagen.includes("/")
    ? producto.imagen
    : `imagenes/${producto.imagen}`;

  const imageSrc = producto.imagen.startsWith("http")
    ? producto.imagen
    : `${API_URL}/${relativePath.replace(/^\//, "")}`;

  const disponible = producto.existencia > 0 ? producto.existencia : 0;

  return (
    <Card className="mt-3 overflow-hidden border-border/50 bg-card shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-stretch">
        <div className="relative h-36 w-full overflow-hidden rounded-md bg-muted/40 sm:h-auto sm:w-40">
          <Image
            src={imageSrc}
            alt={producto.titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain"
            unoptimized
          />
        </div>

        <CardContent className="flex flex-1 flex-col gap-4 p-0 sm:flex-row sm:gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-1 font-medium uppercase tracking-wide">
                {producto.categoria}
              </span>
              <Separator
                orientation="vertical"
                className="hidden h-4 sm:block"
              />
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground"></span>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-4 sm:block"
              />
              <span>Disponible: {producto.existencia}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {producto.titulo}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {producto.descripcion}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between gap-3 sm:min-w-48">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Precio
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatearPrecio.format(producto.precio)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  disponible
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {disponible ? `Disponible: ${disponible}` : "Agotado"}
              </span>
              <Button
                className={`w-full sm:w-auto ${
                  disponible ? "" : "pointer-events-none opacity-70"
                }`}
                variant={disponible ? "secondary" : "outline"}
                disabled={!disponible}
              >
                {disponible ? (
                  <>
                    <Button
                      className={`w-full sm:w-auto ${
                        disponible ? "" : "pointer-events-none opacity-70"
                      }`}
                      variant={disponible ? "secondary" : "outline"}
                      disabled={!disponible}
                      onClick={() =>
                        agregarArticulo({
                          id: producto.id,
                          nombre: producto.titulo,
                          precio: producto.precio,
                          cantidad: 1,
                          imagen: imageSrc,
                          stock: producto.existencia,
                        })
                      }
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Agregar al carrito
                    </Button>
                  </>
                ) : (
                  "Sin stock"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
