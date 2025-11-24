"use client";

import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const data = JSON.parse(saved);
      setUser(data.user);
      setToken(data.token);
    }
  }, []);

  function saveAuth(user: any, token: string) {
    localStorage.setItem("auth", JSON.stringify({ user, token }));
    setUser(user);
    setToken(token);
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Credenciales incorrectas");

    const data = await res.json();
    saveAuth(data.user, data.access_token);
  }

  async function register(nombre: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    if (!res.ok) throw new Error("Error al registrarse");

    const data = await res.json();
    saveAuth(data.user, data.access_token);
  }

  function logout() {
    localStorage.removeItem("auth");
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}