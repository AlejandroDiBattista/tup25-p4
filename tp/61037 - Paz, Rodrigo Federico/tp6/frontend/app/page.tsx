import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
import Carrito from './components/Carrito';

export default async function Home() {
  const productos = await obtenerProductos();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de Productos
          </h1>
         {/*  <p className="text-gray-600 mt-2">
            {productos.length} productos disponibles
          </p> */}
        </div>
      </header>

<main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-4 gap-6">
        {/* Productos */}
        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>

        {/* Carrito */}
        <div className="col-span-1">
          <Carrito />
        </div>
      </main>
    </div>
  );
}
