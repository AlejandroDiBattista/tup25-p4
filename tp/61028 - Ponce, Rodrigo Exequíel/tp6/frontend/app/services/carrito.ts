// frontend/app/services/carrito.ts

import { ItemCarritoCreate, ItemCarritoResponse } from "../types"; // Importamos los tipos

// Usamos una variable de entorno (igual que en productos.ts)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function agregarAlCarrito(
  item: ItemCarritoCreate,
  token: string // ¡Necesitamos el token para la autorización!
): Promise<ItemCarritoResponse> {
  
  try {
    const response = await fetch(`${API_URL}/carrito`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Aquí enviamos el token para que la API sepa quiénes somos
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify(item),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la API nos da un error (ej. "Sin stock"), lo lanzamos
      throw new Error(data.detail || "Error al agregar el producto al carrito");
    }

    return data;

  } catch (error) {
    console.error(error);
    // relanzamos el error para que el componente (la tarjeta) lo atrape
    throw error;
  }
}