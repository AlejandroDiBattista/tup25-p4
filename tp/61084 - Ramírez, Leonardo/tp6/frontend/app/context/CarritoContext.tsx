'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

  const agregarAlCarrito = async (producto_id: number, cantidad: number) => {
    // Primero actualizar el estado local
    setItems((prevItems) => {
      const existente = prevItems.find((item) => item.producto_id === producto_id);
      if (existente) {
        return prevItems.map((item) =>
          item.producto_id === producto_id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prevItems, { producto_id, cantidad }];
    });

    // Intentar sincronizar con el backend (si hay token)
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/carrito`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ producto_id, cantidad }),
        });
      }
    } catch (error) {
      console.error('Error al sincronizar carrito con backend:', error);
    }
  };

  const quitarDelCarrito = async (producto_id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.producto_id !== producto_id));
    
    // Sincronizar con backend
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/carrito/${producto_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error al quitar del carrito en backend:', error);
    }
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
