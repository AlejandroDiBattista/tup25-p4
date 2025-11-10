const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
import { getToken } from './auth';

export async function verCarrito() {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}/carrito`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo obtener el carrito');
  return res.json();
}

export async function cancelarCarrito() {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}/carrito/cancelar`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('No se pudo cancelar el carrito');
  return res.json();
}

export async function finalizarCompra(direccion: string, tarjeta: string) {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}/carrito/finalizar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ direccion, tarjeta }),
  });
  if (!res.ok) throw new Error('No se pudo finalizar la compra');
  return res.json();
}

export async function listarCompras() {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}/compras`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo obtener el historial de compras');
  return res.json();
}

export async function detalleCompra(id: number) {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}/compras/${id}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo obtener el detalle de la compra');
  return res.json();
}
