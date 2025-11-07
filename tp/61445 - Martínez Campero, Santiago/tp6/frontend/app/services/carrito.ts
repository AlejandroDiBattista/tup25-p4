import { Carrito } from '../types';
import { obtenerToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getHeaders(): Promise<HeadersInit> {
  const token = obtenerToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

export async function agregarAlCarrito(
  productoId: number,
  cantidad: number = 1
): Promise<any> {
  const headers = await getHeaders();
  
  const res = await fetch(
    `${API_URL}/carrito?producto_id=${productoId}&cantidad=${cantidad}`,
    {
      method: 'POST',
      headers,
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al agregar al carrito');
  }

  return res.json();
}

export async function obtenerCarrito(): Promise<Carrito> {
  const headers = await getHeaders();
  
  const res = await fetch(`${API_URL}/carrito`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al obtener carrito');
  }

  return res.json();
}

export async function removerDelCarrito(itemId: number): Promise<any> {
  const headers = await getHeaders();
  
  const res = await fetch(`${API_URL}/carrito/${itemId}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al remover del carrito');
  }

  return res.json();
}

export async function actualizarCantidad(itemId: number, cantidad: number): Promise<Carrito> {
  const headers = await getHeaders();
  
  const res = await fetch(`${API_URL}/carrito/${itemId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ cantidad }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al actualizar cantidad');
  }

  return res.json();
}

export async function cancelarCarrito(): Promise<Carrito> {
  const headers = await getHeaders();
  
  const res = await fetch(`${API_URL}/carrito/cancelar`, {
    method: 'POST',
    headers,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al cancelar carrito');
  }

  return res.json();
}
