export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export type CheckoutPayload = {
  nombre: string;
  direccion: string;
  telefono: string;
  metodo_pago?: string; // opcional, el backend asume 'tarjeta'
};

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function authFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  if (!token) {
    const e: any = new Error('No autenticado');
    e.status = 401;
    throw e;
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).detail || ''; } catch {}
    const e: any = new Error(detail || `HTTP ${res.status}`);
    e.status = res.status;
    throw e;
  }
  return res.json();
}

export async function confirmarCompra(payload: CheckoutPayload): Promise<{ ok: boolean; compra_id: number }> {
  return authFetch('/checkout/confirm', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function comprasUsuario() {
  return authFetch('/compras');
}

export function compraPorId(id: number) {
  return authFetch(`/compras/${id}`);
}