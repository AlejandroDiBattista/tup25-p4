import { Producto } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Obtener lista de productos con filtros opcionales
 */
export async function obtenerProductos(
  categoria?: string,
  busqueda?: string
): Promise<Producto[]> {
  const params = new URLSearchParams();
  if (categoria && categoria !== 'todas') {
    params.append('categoria', categoria);
  }
  if (busqueda && busqueda.trim()) {
    params.append('buscar', busqueda.trim());
  }
  
  const url = `${API_URL}/productos${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, { 
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }
  
  return response.json();
}

/**
 * Obtener detalles de un producto específico
 */
export async function obtenerProducto(id: number): Promise<Producto> {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener producto');
  }
  
  return response.json();
}
