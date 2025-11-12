import { Producto } from '../lib/api';

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <div className="border rounded p-3 flex flex-col gap-2">
      <h2 className="font-medium">{producto.titulo}</h2>
      <p className="text-sm text-gray-600 line-clamp-3">{producto.descripcion}</p>
      <p className="font-semibold">${producto.precio}</p>
      <button className="bg-indigo-600 text-white rounded px-3 py-1 text-sm">Agregar</button>
    </div>
  );
}
