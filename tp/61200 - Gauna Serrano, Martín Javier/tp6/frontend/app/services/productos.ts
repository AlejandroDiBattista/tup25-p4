import { Producto } from '../types';
import { Product } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function obtenerProductos(): Promise<Producto[]> {
  const response = await fetch(`${API_URL}/productos`, {
    cache: 'no-store'
export async function getProductos(): Promise<Product[]> {
  const res = await fetch(`${API}/productos`);
  if (!res.ok) return [];
  return res.json();
}

export async function getProducto(id: number): Promise<Product | null> {
  const res = await fetch(`${API}/productos/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// Para llamadas autenticadas (ejemplo addToCart)
export async function addToCart(token: string, product_id: number, cantidad = 1) {
  const res = await fetch(`${API}/carrito`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ product_id, cantidad }),
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }
  
  return response.json();
  return res.json();
}
