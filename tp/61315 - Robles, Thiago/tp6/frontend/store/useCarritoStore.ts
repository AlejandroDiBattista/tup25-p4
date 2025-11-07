// Crear Estado global de Carrito con Zustand

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Luego exportar tipados

export type ItemCarrito = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  stock?: number;
};

type EstadoCarrito = {
  articulos: ItemCarrito[];
  agregarArticulo: (articulo: ItemCarrito) => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  eliminarArticulo: (id: number) => void;
  limpiar: () => void;
};

export type TotalesCarrito = {
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
};

export const agregarArticulo = (
  articulos: ItemCarrito[],
  nuevoArticulo: ItemCarrito
): ItemCarrito[] => {
  const articuloExistente = articulos.find(
    (articulo) => articulo.id === nuevoArticulo.id
  );

  if (!articuloExistente) {
    return [...articulos, { ...nuevoArticulo }];
  }

  const maximo = articuloExistente.stock ?? Number.POSITIVE_INFINITY;

  return articulos.map((articulo) =>
    articulo.id === nuevoArticulo.id
      ? {
          ...articulo,
          cantidad: Math.min(
            maximo,
            articulo.cantidad + nuevoArticulo.cantidad
          ),
        }
      : articulo
  );
};

// ...existing code...
export const actualizarCantidad = (
  articulos: ItemCarrito[],
  id: number,
  cantidad: number
): ItemCarrito[] => {
  return articulos
    .map((articulo) => {
      if (articulo.id !== id) return articulo;

      const stockMax = articulo.stock ?? Number.POSITIVE_INFINITY;
      const nuevaCantidad = Math.min(
        stockMax,
        Math.max(0, articulo.cantidad + cantidad)
      );

      return { ...articulo, cantidad: nuevaCantidad };
    })
    .filter((articulo) => articulo.cantidad > 0);
};

export const eliminarArticulo = (
  articulos: ItemCarrito[],
  id: number
): ItemCarrito[] => articulos.filter((articulo) => articulo.id !== id);

export const limpiar = (): ItemCarrito[] => [];

export const useCarritoStore = create<EstadoCarrito>()(
  persist(
    (actualizar) => ({
      articulos: [],
      agregarArticulo: (nuevoArticulo) =>
        actualizar((estado) => ({
          articulos: agregarArticulo(estado.articulos, nuevoArticulo),
        })),
      actualizarCantidad: (id, cantidad) =>
        actualizar((estado) => ({
          articulos: actualizarCantidad(estado.articulos, id, cantidad),
        })),
      eliminarArticulo: (id) =>
        actualizar((estado) => ({
          articulos: eliminarArticulo(estado.articulos, id),
        })),
      limpiar: () => actualizar({ articulos: limpiar() }),
    }),
    { name: "carrito" }
  )
);

export const calcularTotales = (articulos: ItemCarrito[]): TotalesCarrito => {
  const subtotal = articulos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const envio = subtotal > 1000 ? 0 : 50;

  const iva = articulos.reduce((acc, item) => {
    const tasaIva = item.categoria === "Electronica" ? 0.1 : 0.21;
    return acc + item.precio * item.cantidad * tasaIva;
  }, 0);

  return { subtotal, envio, iva, total: subtotal + iva + envio };
};
