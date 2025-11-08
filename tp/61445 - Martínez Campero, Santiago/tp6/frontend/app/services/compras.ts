import { Compra } from '../types';
import { obtenerToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getHeaders(): Promise<HeadersInit> {
  const token = obtenerToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

export async function obtenerCompras(): Promise<Compra[]> {
  const headers = await getHeaders();
  
  const res = await fetch(`${API_URL}/compras`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al obtener compras');
  }

  return res.json();
}

export async function obtenerCompraDetalle(compraId: number): Promise<Compra> {
  const headers = await getHeaders();
  
  const res = await fetch(`${API_URL}/compras/${compraId}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al obtener compra');
  }

  return res.json();
}
