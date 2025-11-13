"use client";
import { useCart } from "../context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Navbar() {
  const { toggle, count } = useCart();
  const { authenticated, logout } = useAuth();
  const { toast } = useToast();
  const handleLogout = () => {
    logout();
    toast("Sesión cerrada");
  };
  return (
    <nav className="w-full bg-white border-b px-4 py-2 flex gap-4 text-sm text-gray-900">
      <a href="/" className="font-semibold hover:text-gray-700">Productos</a>
      <a href="/compras" className="hover:text-gray-700">Compras</a>
      <div className="ml-auto flex items-center gap-4">
        <button onClick={toggle} className="relative inline-flex items-center justify-center w-9 h-9 rounded hover:bg-gray-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M3 3h2l3.6 7.59a1 1 0 0 0 .9.59H17a1 1 0 0 0 .92-.62L21 6H6" />
            <circle cx="9" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full animate-pulse">
              {count}
            </span>
          )}
        </button>
        {authenticated ? (
          <button onClick={handleLogout} className="hover:text-gray-700">Cerrar sesión</button>
        ) : (
          <>
            <a href="/login" className="hover:text-gray-700">Login</a>
            <a href="/register" className="hover:text-gray-700">Registro</a>
          </>
        )}
      </div>
    </nav>
  );
}
