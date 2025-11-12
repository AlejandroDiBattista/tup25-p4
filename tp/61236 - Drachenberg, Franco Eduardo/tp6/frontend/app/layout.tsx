import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TP6 Shop | Comercio electrónico simple",
  description:
    "Explora el catálogo de TP6 Shop, inicia sesión y gestiona tus compras tal como se muestra en las pantallas 01-06.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
              TP6 Shop
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <Link href="/" className="transition hover:text-slate-900">
                Productos
              </Link>
              <Link href="/compras" className="transition hover:text-slate-900">
                Mis compras
              </Link>
            </nav>
            <div className="flex items-center gap-3 text-sm font-medium">
              <Link
                href="/iniciar-sesion"
                className="rounded-md px-3 py-2 text-slate-600 transition hover:text-slate-900"
              >
                Ingresar
              </Link>
              <Link
                href="/registrar"
                className="rounded-md bg-slate-900 px-4 py-2 text-white shadow-sm transition hover:bg-slate-800"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
