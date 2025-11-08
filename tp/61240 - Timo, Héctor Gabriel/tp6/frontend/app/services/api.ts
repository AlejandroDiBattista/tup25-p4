import { CarritoRead, CompraRead, ItemCarritoCreate, Producto, Usuario, UsuarioCreate } from '@/types';

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

// --- Productos ---

export async function getProductos(query?: string, category?: string): Promise<Producto[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('categoria', category);
    const response = await fetch(`${API_URL}/productos?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Error al obtener los productos');
    }
    return response.json();
}

// --- Carrito ---

export async function getCarrito(token: string): Promise<CarritoRead> {
    const response = await fetch(`${API_URL}/carrito`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener el carrito");
    return response.json();
}

export async function agregarAlCarrito(item: ItemCarritoCreate, token: string): Promise<CarritoRead> {
    const response = await fetch(`${API_URL}/carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Error al agregar al carrito");
    return response.json();
}

export async function quitarDelCarrito(productoId: number, token: string): Promise<CarritoRead> {
    const response = await fetch(`${API_URL}/carrito/${productoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al quitar del carrito");
    return response.json();
}

export async function cancelarCompra(token: string): Promise<void> {
    const response = await fetch(`${API_URL}/carrito/cancelar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al cancelar la compra");
}

// --- Checkout y Compras ---

export async function finalizarCompra(data: { direccion: string, tarjeta: string }, token: string): Promise<CompraRead> {
    const response = await fetch(`${API_URL}/carrito/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al finalizar la compra");
    }
    return response.json();
}

export async function getMisCompras(token: string): Promise<CompraRead[]> {
    const response = await fetch(`${API_URL}/compras`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener el historial de compras");
    return response.json();
}
