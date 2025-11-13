"use client";
import { useCart } from "../context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { toggle, count } = useCart();
  const { authenticated, logout } = useAuth();
  const { toast } = useToast();
  const handleLogout = () => {
    logout();
    toast("Sesión cerrada");
  };
  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6 text-sm text-gray-900">
        <a href="/" className="text-base font-semibold">TP6 Shop</a>
        <a href="/" className="hover:text-gray-700">Productos</a>
        {authenticated && (
          <a href="/compras" className="hover:text-gray-700">Mis compras</a>
        )}
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
            <a href="#" onClick={(e)=>{e.preventDefault(); handleLogout();}} className="hover:text-gray-700">Salir</a>
          ) : (
            <>
              <a href="/login" className="hover:text-gray-700">Ingresar</a>
              <a href="/register" className="hover:text-gray-700">
                <Button asChild variant="outline" size="sm" className="rounded-full bg-gray-50"><span>Crear cuenta</span></Button>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
