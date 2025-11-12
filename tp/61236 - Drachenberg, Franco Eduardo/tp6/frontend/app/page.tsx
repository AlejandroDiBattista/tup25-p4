import { Search } from "lucide-react";

import ProductoCard from "./components/ProductoCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { obtenerProductos } from "./services/productos";

export default async function Home() {
  const productos = await obtenerProductos();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex w-full flex-1 items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar..."
                className="pl-11 shadow-sm"
                aria-label="Buscar productos"
                type="search"
              />
            </div>
            <Select defaultValue="todas">
              <SelectTrigger className="w-48 shadow-sm">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                <SelectItem value="electro">Electrónica</SelectItem>
                <SelectItem value="ropa">Ropa</SelectItem>
                <SelectItem value="joyeria">Joyería</SelectItem>
                <SelectItem value="hogar">Hogar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
        <Card className="hidden h-min lg:block">
          <CardHeader>
            <CardTitle>Inicia sesión</CardTitle>
            <CardDescription>Ingresa para ver y editar tu carrito.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-slate-600">
              Gestiona tus compras, revisa el historial y continúa donde lo
              dejaste.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
