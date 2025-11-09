import { Producto } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function obtenerProductos(): Promise<Producto[]> {
  const response = await fetch(`${API_URL}/productos`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }
  
  return response.json();
}

export async function agregarAlCarrito(usuario_id: number, producto_id: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const response = await fetch(`${API_URL}/carrito?usuario_id=${usuario_id}&producto_id=${producto_id}`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("No se pudo agregar al carrito");
  }

  return response.json();
}

export async function obtenerCarrito(usuario_id: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const response = await fetch(`${API_URL}/carrito?usuario_id=${usuario_id}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el carrito");
  }

  return response.json();
}