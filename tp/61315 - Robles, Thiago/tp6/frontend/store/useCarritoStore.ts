// Crear Estado global de Carrito con Zustand

import { create } from "zustand";
import { persist } from "zustand/middleware";


export type ItemCarrito = {
  id: number;
  nombre: string;
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
): ItemCarrito[] =>
  articulos.filter((articulo) => articulo.id !== id);

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