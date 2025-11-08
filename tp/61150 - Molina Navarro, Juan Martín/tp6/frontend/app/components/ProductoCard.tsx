import Image from "next/image";

import { Producto } from "../types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductoCardProps {
  producto: Producto;
  onAdd?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function ProductoCard({
  producto,
  onAdd,
  disabled = false,
  loading = false,
}: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-6">
      <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-100 md:h-28 md:w-28">
        <Image
          src={`${API_URL}/${producto.imagen}`}
          alt={producto.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 128px"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <div className="flex-1">
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-semibold text-slate-900">
              {producto.titulo}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              {producto.descripcion}
            </CardDescription>
            <p className="text-sm font-medium text-slate-500">
              Categoría: {producto.categoria}
            </p>
          </CardHeader>
        </div>
        <CardContent className="flex flex-col items-start gap-2 p-0 text-right md:items-end">
          <p className="text-lg font-semibold text-slate-900">
            ${producto.precio.toFixed(2)}
          </p>
          <p className="text-sm text-slate-500">
            Disponible: {producto.existencia}
          </p>
          {onAdd && (
            <Button
              className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              onClick={onAdd}
              disabled={disabled}
            >
              {loading ? "Agregando..." : "Agregar al carrito"}
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
