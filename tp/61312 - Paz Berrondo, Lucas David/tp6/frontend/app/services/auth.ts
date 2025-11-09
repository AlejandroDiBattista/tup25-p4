/**
 * Servicio de autenticación para el frontend
 * Maneja registro, login, logout y gestión del token JWT
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Usuario {
  nombre: string;
  email: string;
}

export interface RegistroData {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

/**
 * Registrar un nuevo usuario
 */
export async function registrarUsuario(data: RegistroData): Promise<{ mensaje: string }> {
  const response = await fetch(`${API_URL}/registrar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al registrar usuario');
  }

  return response.json();
}

/**
 * Iniciar sesión
 */
export async function iniciarSesion(data: LoginData): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/iniciar-sesion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al iniciar sesión');
  }

  const tokenData: TokenResponse = await response.json();
  
  // Guardar token en localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', tokenData.access_token);
  }

  return tokenData;
}

/**
 * Cerrar sesión
 */
export async function cerrarSesion(): Promise<void> {
  const token = getToken();
  
  if (token) {
    try {
      await fetch(`${API_URL}/cerrar-sesion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Limpiar token de localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

/**
 * Obtener token del localStorage
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Verificar si el usuario está autenticado
 */
export function estaAutenticado(): boolean {
  return getToken() !== null;
}

/**
 * Obtener headers con autenticación
 */
export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}
