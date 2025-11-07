const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function listarCompras() {
  const res = await fetch(`${API}/compras`, { headers: authHeaders(), cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function compraPorId(id: number) {
  const res = await fetch(`${API}/compras/${id}`, { headers: authHeaders(), cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo obtener la compra');
  return res.json();
}