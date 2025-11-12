import React, { useState } from 'react'

export default function ProductCardFixed({p, onAdd}){
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')
  const outOfStock = p.existencia === 0 || p.existence === 0 || (p.existence === undefined && p.existencia === undefined && (p.stock === 0))
  const title = p.nombre || p.titulo || p.name || 'Sin nombre'
  const price = Number(p.precio ?? p.price ?? 0).toFixed(2)
  const imagenPath = p.imagen || p.image || ''
  const placeholder = '/placeholder.png'
  const normalizedPath = imagenPath ? imagenPath.replace(/^\/+/, '') : ''
  const initialSrc = normalizedPath ? `${API_BASE}/${normalizedPath}` : placeholder
  const [src, setSrc] = useState(initialSrc)

  return (
    <div className="bg-white rounded shadow p-4">
      <img
        src={src}
        alt={title}
        className="w-full h-40 object-cover mb-3 rounded"
        loading="lazy"
        onError={(e)=> { e.currentTarget.onerror = null; e.currentTarget.src = placeholder }}
      />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{p.descripcion}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="text-lg font-bold">${price}</div>
        <div>
          {outOfStock ? (
            <span className="text-red-500">Agotado</span>
          ) : (
            <button onClick={()=> onAdd(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Agregar</button>
          )}
        </div>
      </div>
    </div>
  )
}
