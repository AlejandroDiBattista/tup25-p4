import { Producto } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function obtenerProductos(): Promise<Producto[]> {
  try {
    const response = await fetch(`${API_URL}/productos`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as Producto[];
  } catch (err: any) {
    // Log más detallado en el servidor para depuración
    console.error('Error obteniendo productos desde', API_URL, err);
    // Lanzar un error más informativo para que la UI pueda mostrarlo o Next capture la excepción
    throw new Error(`No se pudo conectar al backend en ${API_URL}: ${err?.message || err}`);
  }
}
