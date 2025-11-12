'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CarritoItem {
  producto_id: number;
  cantidad: number;
}

interface CarritoContextType {
  items: CarritoItem[];
  agregarAlCarrito: (producto_id: number, cantidad: number) => void;
  quitarDelCarrito: (producto_id: number) => void;
  vaciarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CarritoItem[]>([]);

  // Cargar carrito del localStorage al montar
  useEffect(() => {
    const savedCarrito = localStorage.getItem('carrito');
    if (savedCarrito) {
      setItems(JSON.parse(savedCarrito));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregarAlCarrito = (producto_id: number, cantidad: number) => {
    setItems((prevItems) => {
      const existente = prevItems.find((item) => item.producto_id === producto_id);
      if (existente) {
        return prevItems.map((item) =>
          item.producto_id === producto_id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prevItems, { producto_id, cantidad }];
    });
  };

  const quitarDelCarrito = (producto_id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.producto_id !== producto_id));
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  return (
    <CarritoContext.Provider value={{ items, agregarAlCarrito, quitarDelCarrito, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
}
