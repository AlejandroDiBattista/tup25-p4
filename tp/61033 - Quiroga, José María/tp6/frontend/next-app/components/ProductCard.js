export default function ProductCard({p, onAdd}){
  const outOfStock = p.existencia === 0 || p.existence === 0 || p.existence === undefined && p.existencia === undefined && (p.stock === 0)
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold">{p.nombre || p.titulo}</h3>
      <p className="text-sm text-gray-600">{p.descripcion}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="text-lg font-bold">${(p.precio||p.price).toFixed(2)}</div>
        <div>
          {outOfStock ? <span className="text-red-500">Agotado</span> : <button onClick={()=> onAdd(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Agregar</button>}
        </div>
      </div>
    </div>
  )
}
