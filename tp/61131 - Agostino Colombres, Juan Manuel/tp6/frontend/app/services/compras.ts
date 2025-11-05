import { CompraRequest, CompraResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function crearCompra(payload: CompraRequest, token: string): Promise<CompraResponse> {
  const response = await fetch(`${API_URL}/compras`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "No se pudo registrar la compra";
    try {
      const body = await response.json();
      const detail = body?.detail ?? body?.message;
      if (typeof detail === "string" && detail.trim() !== "") {
        message = detail;
      }
    } catch {
      // ignoramos errores de parseo y usamos mensaje genérico
    }

    throw new Error(message);
  }

  return response.json() as Promise<CompraResponse>;
}
