import { AuthResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function registrar(
  nombre: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al registrar');
  }

  const data = await res.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export async function iniciarSesion(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/iniciar-sesion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al iniciar sesión');
  }

  const data = await res.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export async function cerrarSesion(): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) return;

  await fetch(`${API_URL}/auth/cerrar-sesion`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  localStorage.removeItem('token');
}

export function obtenerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function estaAutenticado(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}
