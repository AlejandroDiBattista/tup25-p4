import AuthGate from '@/app/auth/Gate/AuthGate'; // ajustá si no tenés alias @
import { obtenerProductos } from './services/productos';
import ProductoCard from '@/components/ui/ProductoCard';

export default async function HomePage() {
  const productos = await obtenerProductos();

  return (
    <AuthGate>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
            <p className="text-gray-600 mt-2">{productos.length} productos disponibles</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        </main>
      </div>
    </AuthGate>
  );
}
