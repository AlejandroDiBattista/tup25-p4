"use client";
import { CartProvider } from "../context/CartContext";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer"; // ya es client component

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="w-full p-4">{children}</main>
      <CartDrawer />
    </CartProvider>
  );
}