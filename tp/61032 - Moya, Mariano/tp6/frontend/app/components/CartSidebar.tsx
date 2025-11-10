import Link from "next/link";

export default function CartSidebar() {
  const isLogged = typeof window !== "undefined" && !!localStorage.getItem("token");
  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      {isLogged ? (
        <div className="text-sm text-gray-700">
          Estás autenticado. <Link className="text-blue-600 underline" href="/compra">Ver y editar tu carrito</Link>.
        </div>
      ) : (
        <div className="text-sm text-gray-600">Inicia sesión para ver y editar tu carrito.</div>
      )}
    </div>
  );
}
