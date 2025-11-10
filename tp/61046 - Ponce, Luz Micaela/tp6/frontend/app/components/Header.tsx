import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link href="/" className="text-xl font-bold text-gray-900">
              TP6 Shop
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/iniciar-sesion"
              className="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors"
            >
              Ingresar
            </Link>
            <Link
              href="/registrar"
              className="text-sm font-bold text-gray-900 hover:text-pink-500 transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}