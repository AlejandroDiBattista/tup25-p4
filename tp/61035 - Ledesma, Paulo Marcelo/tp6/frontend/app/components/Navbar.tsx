"use client";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 flex justify-between items-center px-6 py-3">
      <div className="text-xl font-semibold text-sky-600">🛍️ TP6 E-Commerce</div>

      <div className="flex gap-4">
        <Link href="/" className="hover:text-sky-600">Inicio</Link>
        {!isLogged ? (
          <>
            <Link href="/login" className="hover:text-sky-600">Ingresar</Link>
            <Link href="/registro" className="hover:text-sky-600">Crear usuario</Link>
          </>
        ) : (
          <>
            <Link href="/compras" className="hover:text-sky-600">Mis compras</Link>
            <button onClick={() => setIsLogged(false)} className="text-red-500 hover:underline">
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
