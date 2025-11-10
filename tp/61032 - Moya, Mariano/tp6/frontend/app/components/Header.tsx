import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<{ nombre?: string; email?: string } | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = localStorage.getItem("user");
    setUsuario(u ? JSON.parse(u) : null);
    const readCount = () => {
      const raw = localStorage.getItem("carrito");
      const list: { id: number; cantidad: number }[] = raw ? JSON.parse(raw) : [];
      setCartCount(list.reduce((acc, it) => acc + (it?.cantidad || 0), 0));
    };
    readCount();
    const handler = () => readCount();
    window.addEventListener("storage", handler);
    window.addEventListener("carrito:changed", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("carrito:changed", handler as EventListener);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">TP6 Shop</h1>
        <nav className="flex gap-3 items-center">
          <Link href="/" className="text-gray-900 hover:text-blue-600 font-medium">Productos</Link>
          <Link href="/compras" className="text-gray-900 hover:text-blue-600">Mis compras</Link>
          <Link href="/compra" className="relative text-gray-900 hover:text-blue-600">
            Carrito
            <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-5 px-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
              {cartCount}
            </span>
          </Link>
          {usuario ? (
            <>
              <span className="text-gray-900 font-medium">{usuario.nombre || usuario.email}</span>
              <button
                className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-black"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  location.reload();
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Ingresar</Link>
              <Link href="/register" className="bg-white text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gray-100 border border-gray-300">Crear cuenta</Link>
            </>
          )}
        </nav>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 text-center font-semibold">
          {error}
        </div>
      )}
    </header>
  );
}
