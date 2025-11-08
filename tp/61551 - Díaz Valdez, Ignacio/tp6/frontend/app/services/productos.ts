import { Producto } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ProductosResponse {
  value: Producto[];
  Count: number;
}

export async function obtenerProductos(): Promise<Producto[]> {
  const response = await fetch(`${API_URL}/productos`, {
    // Evita caché para ver siempre datos actuales; podría ajustarse con revalidate
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }

  const data = await response.json();

  // Soportar tanto array directo (legacy) como objeto { value, Count }
  if (Array.isArray(data)) {
    return data as Producto[];
  }
  if ('value' in data) {
    return (data as ProductosResponse).value;
  }
  return [];
}
