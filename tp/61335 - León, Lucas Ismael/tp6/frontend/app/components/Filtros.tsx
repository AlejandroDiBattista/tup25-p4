"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Filtros() {
  const router = useRouter();
  const sp = useSearchParams();
  const [buscar, setBuscar] = useState(sp.get('buscar') || '');
  const [categoria, setCategoria] = useState(sp.get('categoria') || '');

  function aplicar() {
    const params = new URLSearchParams();
    if (buscar) params.set('buscar', buscar);
    if (categoria) params.set('categoria', categoria);
    router.push(`/?${params.toString()}`);
  }

  function limpiar() {
    setBuscar('');
    setCategoria('');
    router.push('/');
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 border rounded">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Buscar</label>
        <input
          className="border rounded px-2 py-1 text-sm"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Texto en título o descripción"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Categoría</label>
        <input
          className="border rounded px-2 py-1 text-sm"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          placeholder="Ej: Electrónica"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={aplicar}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
        >Aplicar</button>
        <button
          onClick={limpiar}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-3 py-1 rounded"
        >Limpiar</button>
      </div>
    </div>
  );
}
