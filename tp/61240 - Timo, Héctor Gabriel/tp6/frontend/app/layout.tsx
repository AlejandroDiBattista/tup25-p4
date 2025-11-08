import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

  }>) {
  return (
    <html lang="es">
      <AuthProvider>
        <body className={inter.className}>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </body>
      </AuthProvider>
    </html>
  );
}

