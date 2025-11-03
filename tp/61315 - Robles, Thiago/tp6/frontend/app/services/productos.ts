import { Producto } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function obtenerProductos(params?: { categoria?: string; buscar?: string }) {

  const query = new URLSearchParams();

  if (params?.categoria) query.set('categoria', params.categoria);
  if (params?.buscar) query.set('buscar', params.buscar);

  const url = `${API_URL}/productos${query.toString() ? `?${query}` : ''}`;

  const respuesta = await fetch(url, { cache: 'no-store' });
  
  if (!respuesta.ok) {
    throw new Error(`Error al cargar productos (${respuesta.status})`);
  }
  return (await respuesta.json()) as Producto[];
}