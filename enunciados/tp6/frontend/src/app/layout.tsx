import './globals.css';
import Link from 'next/link';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from '@/components/Navbar';

export const metadata = {
  title: 'E-commerce de Ropa',
  description: 'Compra ropa moderna al mejor precio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="p-6">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}