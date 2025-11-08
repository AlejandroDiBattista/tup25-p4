'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type User = { id: number; nombre: string } | null;

interface Props {
    user?: User;        
    onLogout?: () => void;
}

function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
    return (
        <Link
        href={href}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition
            ${active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}
        `}
        >
        {children}
        </Link>
    );
}

export default function Navbar({ user, onLogout }: Props) {
const pathname = usePathname();

    return (
        <nav className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            {/* Marca */}
            <Link href="/" className="text-xl font-semibold tracking-tight">
            TP6 <span className="font-bold">Shop</span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-2">
            <NavLink href="/" active={pathname === '/'}>
                Productos
            </NavLink>

            {/* Estado sin sesión */}
            {!user && (
                <>
                <NavLink href="/ingresar" active={pathname?.startsWith('/ingresar')}>
                    Ingresar
                </NavLink>
                <Link
                    href="/registrar"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition
                    ${pathname?.startsWith('/registrar') ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                >
                    Crear cuenta
                </Link>
                </>
            )}

            {/* Estado con sesión */}
            {user && (
                <>
                <NavLink href="/compras" active={pathname?.startsWith('/compras')}>
                    Mis compras
                </NavLink>
                <span className="px-3 py-1.5 text-sm text-gray-700"> {user.nombre} </span>
                <button
                    onClick={onLogout}
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                    Salir
                </button>
                </>
            )}
            </div>
        </div>
        </nav>
    );
}
