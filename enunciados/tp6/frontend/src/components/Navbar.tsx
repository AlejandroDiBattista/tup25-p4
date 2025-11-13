'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-md hover:bg-black hover:text-white transition ${
      pathname === path ? "bg-black text-white" : "text-gray-700"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <Link href="/" className="text-2xl font-bold text-black">
          👕 E-Shop
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className={linkClass("/")}>Inicio</Link>
          {!isAuthenticated ? (
            <>
              <Link href="/login" className={linkClass("/login")}>Iniciar sesión</Link>
              <Link href="/register" className={linkClass("/register")}>Registrarse</Link>
            </>
          ) : (
            <>
              <span className="text-gray-700 font-semibold">{user?.username || user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Salir
              </button>
            </>
          )}
          <Link href="/cart" className={linkClass("/cart")}>Carrito</Link>
          <Link href="/history" className={linkClass("/history")}>Historial</Link>
        </div>
      </div>
    </nav>
  );
}