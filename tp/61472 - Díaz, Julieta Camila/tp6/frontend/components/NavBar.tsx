"use client";

import Link from "next/link";
import { useAuth } from "../src/context/AuthContext";
import { useCart } from "../src/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totals } = useCart();

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Logo / Inicio */}
      <div>
        <Link href="/" className="text-xl font-semibold">
          TP6 Shop
        </Link>
      </div>

      {/* Navegación */}
      <div className="flex items-center gap-6">

        <Link href="/compras" className="hover:underline">
          Mis compras
        </Link>

        <Link href="/confirmar" className="hover:underline">
          Carrito (${totals.total.toFixed(2)})
        </Link>

        {/* Autenticación */}
        {!user ? (
          <>
            <Link href="/login" className="hover:underline">
              Iniciar sesión
            </Link>

            <Link href="/registrar" className="hover:underline">
              Registrarse
            </Link>
          </>
        ) : (
          <>
            <span className="text-slate-700">Hola, {user.nombre}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-slate-900 text-white rounded-md hover:bg-slate-700"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}