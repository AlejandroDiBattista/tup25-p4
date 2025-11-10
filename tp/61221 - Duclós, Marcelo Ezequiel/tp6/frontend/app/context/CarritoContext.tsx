'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Producto {
  id: number;
  titulo: string;
  precio: number;
  descripcion: string;
  categoria: string;
  valoracion?: number;
  existencia: number;
  imagen: string;
  disponible: boolean;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoContextType {
  items: ItemCarrito[];
  agregarProducto: (producto: Producto, cantidad?: number) => void;
  removerProducto: (productoId: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  const agregarProducto = (producto: Producto, cantidad: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.producto.id === producto.id);
      
      if (existingItem) {
        // Actualizar cantidad si ya existe
        return prevItems.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Agregar nuevo item
        return [...prevItems, { producto, cantidad }];
      }
    });
  };

  const removerProducto = (productoId: number) => {
    setItems(prevItems => prevItems.filter(item => item.producto.id !== productoId));
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removerProducto(productoId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.producto.id === productoId
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  // Cálculos
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  
  // IVA diferenciado: 21% electrónicos, 10.5% general
  const iva = items.reduce((sum, item) => {
    const esElectronico = item.producto.categoria.toLowerCase().includes('electrón');
    const porcentajeIva = esElectronico ? 0.21 : 0.105;
    return sum + (item.producto.precio * item.cantidad * porcentajeIva);
  }, 0);
  
  // Envío gratis si el subtotal > $1500, sino $200
  const envio = subtotal > 1500 ? 0 : 200;
  const total = subtotal + iva + envio;

  const value: CarritoContextType = {
    items,
    agregarProducto,
    removerProducto,
    actualizarCantidad,
    vaciarCarrito,
    totalItems,
    subtotal,
    iva,
    envio,
    total,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
}