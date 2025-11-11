'use client';

import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

export function SiteHeader(): JSX.Element {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          TP6 Store
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link
            href="/"
            className="transition hover:text-slate-900"
          >
            Productos
          </Link>
          <Link
            href="/compras"
            className="transition hover:text-slate-900"
          >
            Compras
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-700 sm:inline">
                Hola, {user.nombre}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

