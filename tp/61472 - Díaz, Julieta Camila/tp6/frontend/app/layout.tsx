import "./globals.css";
import type { Metadata } from "next";

import { AuthProvider } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartContext"
import Navbar from "../components/NavBar";

export const metadata: Metadata = {
  title: "TP6 Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#f5f5f7] text-slate-900">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}