import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "TP6 - E-commerce",
  description: "Next.js + FastAPI | TP6 Shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b">
          <nav className="container flex items-center justify-between h-14">
            <Link href="/" className="font-semibold">TP6 Shop</Link>
            <div className="flex gap-3">
              <Link href="/login" className="btn">Iniciar sesión</Link>
              <Link href="/registro" className="btn">Registrarme</Link>
              <Link href="/carrito" className="btn">Carrito</Link>
              <Link href="/compras" className="btn">Mis compras</Link>
            </div>
          </nav>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
