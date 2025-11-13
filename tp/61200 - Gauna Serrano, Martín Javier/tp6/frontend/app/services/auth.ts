const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function register(nombre: string, email: string, password: string) {
  const res = await fetch(`${API}/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password }),
  });
  return res;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API}/iniciar-sesion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  const data = await res.json();
  if (data?.access_token) {
    localStorage.setItem("tp_token", data.access_token);
  }
  return data;
}

export function logout() {
  const token = getToken();
  if (token) {
    fetch(`${API}/cerrar-sesion`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem("tp_token");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tp_token");
}

export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export default { register, login, logout, getToken, authHeaders, isLoggedIn };
