import { Producto } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Filtros {
  search?: string;
  categoria?: string;
}

export async function obtenerProductos(filtros: Filtros = {}): Promise<Producto[]> {
  const params = new URLSearchParams();

  if (filtros.search) params.append('search', filtros.search);
  if (filtros.categoria) params.append('categoria', filtros.categoria);

  const url = `${API_URL}/productos${params.toString() ? `?${params}` : ''}`;

  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }

  return response.json();
}
