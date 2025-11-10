import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
import Filtros from './components/Filtros';
import SidebarCarrito from './components/SidebarCarrito';

export default async function Home({ searchParams }: { searchParams?: { buscar?: string; categoria?: string } }) {
  const productos = await obtenerProductos({
    buscar: searchParams?.buscar,
    categoria: searchParams?.categoria,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-sm">
          <div className="font-semibold">TP6 Shop</div>
          {/* El Header global ya muestra login/registro/mis compras/salir */}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-3">
          <Filtros />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="space-y-3 lg:col-span-2">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          <div>
            <SidebarCarrito />
          </div>
        </div>
      </main>
    </div>
  );
}
