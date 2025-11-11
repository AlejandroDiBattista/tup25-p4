// frontend/app/services/compra.ts

import { CompraCreate, CompraResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function finalizarCompra(
  compra: CompraCreate,
  token: string
): Promise<CompraResponse> {

  try {
    const response = await fetch(`${API_URL}/carrito/finalizar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify(compra),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Error al finalizar la compra");
    }

    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}