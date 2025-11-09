'use client';

import { useState, useEffect, useCallback } from 'react';
import { Carrito } from '../types';
import * as carritoService from '../services/carrito';
import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para gestionar el carrito de compras
 */
export function useCarrito() {
  const { isAuthenticated } = useAuth();
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar el carrito desde la API
   */
  const cargarCarrito = useCallback(async () => {
    if (!isAuthenticated) {
      setCarrito(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await carritoService.obtenerCarrito();
      setCarrito(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar carrito';
      setError(message);
      console.error('Error al cargar carrito:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Cargar carrito al montar o cuando cambie la autenticación
  useEffect(() => {
    if (isAuthenticated) {
      cargarCarrito();
    } else {
      setCarrito(null);
    }
  }, [isAuthenticated, cargarCarrito]);

  /**
   * Agregar producto al carrito
   */
  const agregar = async (producto_id: number, cantidad: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await carritoService.agregarAlCarrito(producto_id, cantidad);
      setCarrito(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al agregar producto';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Quitar producto del carrito
   */
  const quitar = async (producto_id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await carritoService.quitarDelCarrito(producto_id);
      setCarrito(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al quitar producto';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancelar carrito (vaciar)
   */
  const cancelar = async () => {
    try {
      setLoading(true);
      setError(null);
      await carritoService.cancelarCarrito();
      await cargarCarrito(); // Recargar carrito vacío
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cancelar carrito';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Finalizar compra
   */
  const finalizar = async (direccion: string, tarjeta: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await carritoService.finalizarCompra(direccion, tarjeta);
      setCarrito(null); // Limpiar carrito después de finalizar
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al finalizar compra';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener cantidad total de items en el carrito
   */
  const cantidadTotal = carrito?.items.reduce((acc, item) => acc + item.cantidad, 0) || 0;

  return {
    carrito,
    loading,
    error,
    agregar,
    quitar,
    cancelar,
    finalizar,
    recargar: cargarCarrito,
    cantidadTotal
  };
}
