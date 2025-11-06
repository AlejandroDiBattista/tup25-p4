import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          TP6 Shop
        </Link>
        
        <div className="flex gap-4">
          <Link href="/productos">
            <Button variant="ghost">Productos</Button>
          </Link>
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
          <Link href="/carrito">
            <Button variant="outline">Carrito</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
