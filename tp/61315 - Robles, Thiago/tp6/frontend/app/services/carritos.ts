

import { cache } from 'react';
import { Carrito } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const obtenerCarrito = cache(async (usuarioId: string) => {
  const respuesta = await fetch(`${API_URL}/carritos/${usuarioId}`);

  if (!respuesta.ok) {
    throw new Error(`Error al cargar el carrito (${respuesta.status})`);
  }
  return await respuesta.json() as Carrito;
});
  
