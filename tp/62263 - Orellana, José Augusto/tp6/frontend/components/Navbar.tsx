import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                    TP6 Shop
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                        <Link href="/">Productos</Link>
                    </Button>

                    <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                        <Link href="/login">Ingresar</Link>
                    </Button>

                    <Button variant="secondary" asChild>
                        <Link href="/registro">Crear cuenta</Link>
                    </Button>
                </div>
            </nav>
        </header>
    );
}