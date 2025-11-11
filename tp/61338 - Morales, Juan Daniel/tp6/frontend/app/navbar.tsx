"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Auth, getUsuarioActual } from "./services/productos";

type Usuario = { nombre: string; email: string } | null;

export default function Navbar() {
  const [usuario, setUsuario] = useState<Usuario>(null);
  const [tieneSesion, setTieneSesion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const u = getUsuarioActual();

    if (token) {
      setTieneSesion(true);
      // si no hay usuario guardado pero hay token, mostramos algo genérico
      setUsuario(
        u || {
          nombre: "Usuario",
          email: "",
        }
      );
    } else {
      setTieneSesion(false);
      setUsuario(null);
    }
  }, []);

  const handleLogout = async () => {
    await Auth.logout();
    setTieneSesion(false);
    setUsuario(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-[var(--color-primario)] text-white shadow-sm">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          🛍️ TP6 Shop
        </Link>

        {!tieneSesion ? (
          // ==== NAV SIN SESIÓN ====
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-white text-[var(--color-primario)] font-medium hover:bg-gray-100 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="px-4 py-2 rounded-md bg-white text-[var(--color-primario)] font-medium hover:bg-gray-100 transition"
            >
              Registrarme
            </Link>
            <Link
              href="/carrito"
              className="px-4 py-2 rounded-md bg-white text-[var(--color-primario)] font-medium hover:bg-gray-100 transition"
            >
              Carrito
            </Link>
            <Link
              href="/compras"
              className="px-4 py-2 rounded-md bg-white text-[var(--color-primario)] font-medium hover:bg-gray-100 transition"
            >
              Mis compras
            </Link>
          </div>
        ) : (
          // ==== NAV CON SESIÓN ACTIVA ====
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-semibold hover:underline hover:text-gray-200"
            >
              Productos
            </Link>
            <Link
              href="/carrito"
              className="hover:underline hover:text-gray-200"
            >
              Carrito
            </Link>
            <Link
              href="/compras"
              className="hover:underline hover:text-gray-200"
            >
              Mis compras
            </Link>

            <span className="text-gray-100 font-medium">
              👤 {usuario?.nombre || "Usuario"}
            </span>

            <button
              onClick={handleLogout}
              className="bg-white text-[var(--color-primario)] font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
