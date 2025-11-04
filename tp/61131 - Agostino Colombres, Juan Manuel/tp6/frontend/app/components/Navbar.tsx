"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadSession = () => {
      const storedToken = window.localStorage.getItem("token");
      const storedNombre = window.localStorage.getItem("usuarioNombre");
      setToken(storedToken);
      setNombre(storedToken ? storedNombre : null);
    };

    loadSession();

    const handleStorage = () => {
      loadSession();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem("token");
    window.localStorage.removeItem("usuarioNombre");
    setToken(null);
    setNombre(null);
    setMessage("Sesión cerrada");
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/globe.svg" alt="TP6 Shop" width={40} height={40} />
          <div>
            <Link href="/" className="text-sm font-semibold text-blue-600">TP6 Shop</Link>
          </div>
        </div>

        <nav className="flex items-center gap-1 text-sm text-gray-600">
          <Link
            href="/"
            className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition"
          >
            Productos
          </Link>
          {token && (
            <Link
              href="/compras"
              className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition"
            >
              Mis compras
            </Link>
          )}
          {token ? (
            <div className="flex items-center gap-3 pl-3 ml-3 border-l border-gray-200">
              {nombre && <span className="text-gray-700 font-medium">{nombre}</span>}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-3 ml-3 border-l border-gray-200">
              <Link
                href="/login?mode=login"
                className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition"
              >
                Ingresar
              </Link>
              <Link
                href="/login?mode=register"
                className="px-3 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Crear cuenta
              </Link>
            </div>
          )}
        </nav>
      </div>
      {message && (
        <div className="bg-green-50 border-t border-green-200 text-green-600 text-sm text-center py-1" role="status" aria-live="polite">
          {message}
        </div>
      )}
    </header>
  );
}
