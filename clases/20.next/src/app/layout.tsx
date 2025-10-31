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
  title: "La Proxima Agenda",
  description: "Agenda generada con Next.js 15.2 y Tailwind CSS",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <header className="sticky top-0 z-50 bg-blue-600/90 backdrop-blur-sm text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <a href="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">
              Agenda de contactos
            </a>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
