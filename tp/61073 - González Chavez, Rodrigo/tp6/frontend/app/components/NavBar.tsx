"use client";

import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "./ui/button";

export default function NavBar() {

const { token, usuario, cerrarSesion } = useAuthStore();

return (
    <header className="border-b bg-white sticky top-0 z-50 pb-2">
        <nav className="mas-w-7xl mx-auto flex items-center justify-between px-6 py-3">
            <Link href="/" className="text-lg font-semibold">
                TP6
            </Link>

            <div className="flex items-center gap-4">
                <Link href="/" className="text-base text-gray-700 hover:text-gray-950">
                    Productos
                </Link>
                    {!token ? (
                            <>
                                <Link href="/login" className="text-base text-gray-700 hover:text-gray-950">
                                    Ingresar
                                </Link>
                                <Button asChild className="text-base px-3 py-1">
                                    <Link href="/register">Crear Cuenta</Link>
                                </Button>
                        </>
                    ) : (
                        <>
                            <span className="text-base text-gray-600">Hola, {usuario}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    cerrarSesion()
                                    window.location.href = "/"
                                }}
                            >
                                Cerrar Sesión
                            </Button>
                        </>
                    )}
            </div>
        </nav>
    </header>
)
}