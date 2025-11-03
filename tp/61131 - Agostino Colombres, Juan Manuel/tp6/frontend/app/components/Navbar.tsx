"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadToken = () => {
      setToken(window.localStorage.getItem("token"));
    };

    loadToken();

    const handleStorage = () => {
      setToken(window.localStorage.getItem("token"));
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
    setToken(null);
    setMessage("Sesión cerrada");
    router.push("/");
  };

  const linkClasses = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === href
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
    }`;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-gray-900">
          E-Commerce TP6
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className={linkClasses("/")}>
            Productos
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link href="/login" className={linkClasses("/login")}>
              Iniciar sesión
            </Link>
          )}
        </nav>
        {message && (
          <span className="text-sm text-green-600" role="status">
            {message}
          </span>
        )}
      </div>
    </header>
  );
}
