import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tienda Electrónica",
  description: "Tu tienda de electrónica de confianza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-900 text-white mt-12">
          <div className="container mx-auto px-4 py-8">
            <p>&copy; 2024 Tienda Electrónica. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
