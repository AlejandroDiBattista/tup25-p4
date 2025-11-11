'use client';
import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar = ({ onSearch }: NavbarProps) => {
  const [isLogged, setIsLogged] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const handleBuscar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(busqueda.trim().toLowerCase());
  };

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 flex flex-wrap justify-between items-center px-6 py-3 gap-3">
      {/* Logo / título */}
      <div className="text-xl font-semibold text-sky-600">
        🛍️ TP6 E-Commerce
      </div>

      {/* Barra de búsqueda */}
      <form onSubmit={handleBuscar} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-3 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm w-64"
        />
        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition text-sm"
        >
          Buscar
        </button>
      </form>

      {/* Enlaces de navegación */}
      <div className="flex gap-4 items-center">
        <Link href="/" className="hover:text-sky-600">
          Inicio
        </Link>
        {!isLogged ? (
          <>
            <Link href="/login" className="hover:text-sky-600">
              Ingresar
            </Link>
            <Link href="/registro" className="hover:text-sky-600">
              Crear usuario
            </Link>
          </>
        ) : (
          <>
            <Link href="/compras" className="hover:text-sky-600">
              Mis compras
            </Link>
            <button
              onClick={() => setIsLogged(false)}
              className="text-red-500 hover:underline"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
