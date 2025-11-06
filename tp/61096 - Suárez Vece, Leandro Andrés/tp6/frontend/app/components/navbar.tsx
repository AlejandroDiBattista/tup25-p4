import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cerrarSesion } from "../services/usuarios";

interface NavbarProps {
    token: string
}


export default function Navbar({ token }: NavbarProps) {


    const logout = () => {
        try {
            cerrarSesion(token!)
            localStorage.removeItem("token");
        } catch (error) {
            console.error("Error al cerrar sesión");
        }
    }

    return (
        <nav className="flex items-center justify-end space-x-4 p-4">
            <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
            >
                Productos
            </Link>

            <Link
                href="/login"
                className="text-sm font-medium hover:text-primary transition-colors"
            >
                Ingresar
            </Link>

            <Button variant="outline">
                <Link href="/registro">
                    Crear cuenta
                </Link>
            </Button>
        </nav>
    );
}