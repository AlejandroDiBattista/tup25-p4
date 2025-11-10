"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { obtenerCarrito, agregarAlCarrito, quitarDelCarrito } from '../services/cart';
import { Producto } from '../types';

interface CartItem {
  cantidad: number;
  producto: Producto;
}

export interface CartData {
  id: number;
  productos: CartItem[];
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
}

interface CartContextType {
  cart: CartData | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (producto_id: number, cantidad: number) => Promise<void>;
  removeItem: (producto_id: number) => Promise<void>;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);


  const openCart = useCallback(() => setIsCartOpen(true), []);

  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cartData = await obtenerCarrito();
      setCart(cartData);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('autenticado')) {
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (producto_id: number, cantidad: number) => {
    try {
      await agregarAlCarrito(producto_id, cantidad);
      await fetchCart();
      openCart();
    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  }, [fetchCart, openCart]);

  const removeItem = useCallback(async (producto_id: number) => {
    try {
      await quitarDelCarrito(producto_id);
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  }, [fetchCart]);

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addItem,
    removeItem,
    isCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}