import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TP6 Shop",
  description: "E-commerce con Next.js y FastAPI",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <AuthProvider>
          <CartProvider>
            <main className="container mx-auto p-6">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

