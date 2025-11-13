import { authHeaders, getToken } from "./auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function buildHeaders(json = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  const t = getToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  return headers;
}

export async function getCart() {
  const headers = buildHeaders(true);
  const res = await fetch(`${API}/carrito`, { headers });
  if (!res.ok) return null;
  return res.json();
}

export async function addToCart(product_id: number, cantidad = 1) {
  const headers = buildHeaders(true);
  const res = await fetch(`${API}/carrito`, {
    method: "POST",
    headers,
    body: JSON.stringify({ product_id, cantidad }),
  });
  return res;
}

export async function removeFromCart(product_id: number) {
  const headers = buildHeaders();
  const res = await fetch(`${API}/carrito/${product_id}`, { method: "DELETE", headers });
  return res;
}

export async function finalizeCart(direccion: string, tarjeta: string) {
  const headers = buildHeaders(true);
  const res = await fetch(`${API}/carrito/finalizar`, {
    method: "POST",
    headers,
    body: JSON.stringify({ direccion, tarjeta }),
  });
  return res;
}

export async function cancelCart() {
  const headers = buildHeaders(true);
  const res = await fetch(`${API}/carrito/cancelar`, { method: "POST", headers });
  return res;
}

export async function getPurchases() {
  const headers = buildHeaders();
  const res = await fetch(`${API}/compras`, { headers });
  if (!res.ok) return [];
  return res.json();
}

export async function getPurchase(id: number) {
  const headers = buildHeaders();
  const res = await fetch(`${API}/compras/${id}`, { headers });
  if (!res.ok) return null;
  return res.json();
}
