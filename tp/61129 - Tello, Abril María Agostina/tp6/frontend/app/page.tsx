
import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';


export default async function Home() {
  const productos = await obtenerProductos();
  const categorias = Array.from(new Set(productos.map(p => p.categoria)));

  // Simulación de estado para filtro y búsqueda (en server component, solo visual)
  // En client component, usar useState y lógica real

  return (
    <div className="min-h-screen bg-gray-50">
  <nav className="bg-gray-100 border-b border-gray-300 shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="font-bold text-xl">TP6 Shop</div>
        <div className="flex gap-4 items-center">
          <a href="#" className="font-bold text-gray-700 hover:text-blue-600 transition">Productos</a>
          <a href="#" className="font-bold text-gray-700 hover:text-blue-600 transition">Ingresar</a>
          <a href="#" className="bg-blue-600 px-4 py-2 rounded font-bold text-white shadow hover:bg-transparent hover:text-blue-600 border border-blue-600 transition">Crear cuenta</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
              <input type="text" placeholder="Buscar..." className="border rounded px-4 py-2 w-full md:w-1/2" />
              <select className="border rounded px-4 py-2 w-full md:w-1/4">
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-6">
              {productos.map((producto) => (
                <div key={producto.id} className="bg-white rounded-lg shadow flex flex-row items-center p-4">
                  <img src={`http://localhost:8000/${producto.imagen}`} alt={producto.titulo} className="w-32 h-32 object-contain rounded mr-6 bg-gray-100" />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">{producto.titulo}</h2>
                    <p className="text-gray-600 mb-2">{producto.descripcion}</p>
                    <div className="text-sm text-gray-500 mb-2">Categoría: {producto.categoria}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <div className="text-2xl font-bold text-gray-800">${producto.precio.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Disponible: {producto.existencia}</div>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Agregar al carrito</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow p-6 h-fit mt-2">
            <div className="text-gray-600 text-center">Inicia sesión para ver y editar tu carrito.</div>
          </aside>
        </div>
      </main>
    </div>
  );
}
