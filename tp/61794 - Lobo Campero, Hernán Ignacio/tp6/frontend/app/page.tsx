import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
import Header from './components/Header';
import { Producto } from './types';

export default async function Home() {
  let productos: Producto[] = [];
  let error: string | null = null;

  try {
    productos = await obtenerProductos();
  } catch (err) {
    error = 'No se pudo conectar con el servidor. Por favor, verifica que el backend esté corriendo en http://localhost:8000';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Catálogo de Productos
          </h2>
          <p className="text-gray-600 mt-2">
            {productos.length > 0 ? `${productos.length} productos disponibles` : 'Cargando productos...'}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}
        
        {productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
