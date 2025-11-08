import { Usuario, UsuarioCreate } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// --- Autenticación ---

export async function iniciarSesion(email: string, password: string): Promise<{ access_token: string }> {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await fetch(`${API_URL}/iniciar-sesion`, {
        method: 'POST',
        body: params,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
    }
    return response.json();
}

export async function registrarUsuario(usuario: UsuarioCreate): Promise<Usuario> {
    const response = await fetch(`${API_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar usuario');
    }
    return response.json();
}

export async function getMiPerfil(token: string): Promise<Usuario> {
    const response = await fetch(`${API_URL}/usuarios/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Sesión inválida o expirada');
    }
    return response.json();
}
