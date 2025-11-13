"use client";

import { useState } from "react";
import { Producto } from "@/app/types/producto";

export function useCarrito() {
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const agregar = (producto: Producto) => {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map(p =>
          p.id === producto.id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitar = (id: number) => {
    setCarrito(carrito.filter(p => p.id !== id));
  };

  const vaciar = () => setCarrito([]);

  return { carrito, agregar, quitar, vaciar };
}