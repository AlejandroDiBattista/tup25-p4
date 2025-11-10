import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
import Filtros from './components/Filtros';

export default async function Home({ searchParams }: { searchParams?: { buscar?: string; categoria?: string } }) {
  const productos = await obtenerProductos({
    buscar: searchParams?.buscar,
    categoria: searchParams?.categoria,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600 mt-2">
            {productos.length} productos disponibles
          </p>
          <div className="mt-4">
            {/* Filtros de búsqueda y categoría */}
            <Filtros />
          </div>
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
  );
}
