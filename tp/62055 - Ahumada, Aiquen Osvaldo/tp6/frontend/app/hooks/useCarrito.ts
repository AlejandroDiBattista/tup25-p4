"use client";
import { useAuth } from './useAuth';

export function useCarrito() {
  const { token, isAuthenticated } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  async function agregarAlCarrito(producto: any) {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para agregar productos al carrito');
    }
    if (!producto || producto.existencia <= 0) {
      throw new Error('No hay stock disponible para este producto');
    }
    const response = await fetch(`${API_URL}/carrito`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ producto_id: producto.id, cantidad: 1 })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al agregar al carrito');
    }
    return response.json();
  }

  async function obtenerCarrito() {
    if (!isAuthenticated) throw new Error('Debes iniciar sesión para ver el carrito');
    const response = await fetch(`${API_URL}/carrito`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al obtener el carrito');
    }
    return response.json();
  }

  async function quitarDelCarrito(producto_id: number) {
    if (!isAuthenticated) throw new Error('Debes iniciar sesión para modificar el carrito');
    const response = await fetch(`${API_URL}/carrito/${producto_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al quitar producto del carrito');
    }
    return response.json();
  }

  async function finalizarCompra() {
    if (!isAuthenticated) throw new Error('Debes iniciar sesión para finalizar la compra');
    const response = await fetch(`${API_URL}/carrito/finalizar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al finalizar la compra');
    }
    return response.json();
  }

  async function cancelarCompra() {
    if (!isAuthenticated) throw new Error('Debes iniciar sesión para cancelar la compra');
    const response = await fetch(`${API_URL}/carrito/cancelar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al cancelar el carrito');
    }
    return response.json();
  }

  return { agregarAlCarrito, obtenerCarrito, quitarDelCarrito, finalizarCompra, cancelarCompra };
}
