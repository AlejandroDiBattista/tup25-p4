import "./globals.css";
import { Navbar } from "./components/Navbar";

export const metadata = {
  title: "E-Commerce TP6",
  description: "Trabajo Práctico 6 - Programación IV",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-sky-100 to-white text-gray-900">
        <Navbar />
        <main className="flex gap-6 p-6">{children}</main>
      </body>
    </html>
  );
}
