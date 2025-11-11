
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
          <a href="#" className="font-bold text-gray-700 hover:text-blue-600 hover:underline transition">Productos</a>
          <a href="/login" className="font-bold text-gray-700 hover:text-blue-600 hover:underline transition">Ingresar</a>
          <a href="#" className="bg-blue-600 px-4 py-2 rounded font-bold text-white shadow hover:bg-transparent hover:text-blue-600 border border-blue-600 transition">Crear cuenta</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-row gap-6 items-start">
          <div className="flex-1">
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Buscar..." className="bg-white border border-gray-300 rounded-lg px-4 py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
              <select className="bg-white border border-gray-300 rounded-lg px-4 py-3 w-full max-w-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition" style={{ minWidth: '200px' }}>
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
                    <h2 className="text-xl font-bold mb-1">
                      {producto.nombre ? (
                        <span className="block text-gray-900">{producto.nombre}</span>
                      ) : null}
                      <span className="block text-gray-900">{producto.titulo}</span>
                    </h2>
                    <p className="text-gray-600 mb-2">{producto.descripcion}</p>
                    <div className="text-sm text-gray-500 mb-2">Categoría: {producto.categoria}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <div className="text-2xl font-bold text-gray-800">${producto.precio.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Disponible: {producto.existencia}</div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-transparent hover:text-blue-600 border border-blue-600 transition">Agregar al carrito</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="w-full max-w-xs bg-white rounded-lg shadow p-6 h-fit" style={{ minWidth: '280px' }}>
            <div className="text-gray-600 text-center">Inicia sesión para ver y editar tu carrito.</div>
          </aside>
        </div>
      </main>
    </div>
  );
}
