import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tienda Online",
  description: "Proyecto final de Programación 4",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <AuthProvider>
        <CartProvider>
          <body className={inter.className}>
            <Navbar />
            <main className="container mx-auto p-4">
              {children}
            </main>
          </body>
        </CartProvider>
      </AuthProvider>
    </html>
  );
}

