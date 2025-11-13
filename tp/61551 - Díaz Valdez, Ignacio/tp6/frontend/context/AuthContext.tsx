"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { logout as apiLogout } from "@/lib/api";

interface AuthState {
  authenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  const syncFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    setAuthenticated(Boolean(localStorage.getItem("token")));
  }, []);

  useEffect(() => {
    syncFromStorage();
    const handler = () => syncFromStorage();
    window.addEventListener("token-changed", handler);
    return () => window.removeEventListener("token-changed", handler);
  }, [syncFromStorage]);

  const logout = useCallback(() => {
    apiLogout();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
