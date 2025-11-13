"use client";
import Link from "next/link";
import { isLoggedIn, logout } from "../services/auth";
import { useState, useEffect } from "react";

export default function Header() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(isLoggedIn());
    const onStorage = () => setLogged(isLoggedIn());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    logout();
    setLogged(false);
    location.href = "/";
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/">Productos</Link>
      <Link href="/cart">Carrito</Link>
      <Link href="/orders">Mis compras</Link>
      {logged ? (
        <button onClick={handleLogout} className="ml-4 px-3 py-1 border rounded">Salir</button>
      ) : (
        <div className="ml-4">
          <Link href="/login" className="mr-2">Ingresar</Link>
          <Link href="/register">Crear cuenta</Link>
        </div>
      )}
    </div>
  );
}
