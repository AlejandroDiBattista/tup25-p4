import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">TP6 Shop</h1>
        <nav className="flex gap-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Productos</Link>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Ingresar</Link>
          <Link href="/register" className="bg-gray-100 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gray-200 border">Crear cuenta</Link>
        </nav>
      </div>
    </header>
  );
}
