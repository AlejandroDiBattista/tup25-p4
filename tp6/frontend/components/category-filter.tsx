'use client';

interface CategoryFilterProps {
  categorias: string[];
  categoriaSeleccionada: string;
  onSelectCategoria: (categoria: string) => void;
}

export function CategoryFilter({
  categorias,
  categoriaSeleccionada,
  onSelectCategoria,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategoria('')}
        className={`px-4 py-2 rounded-lg transition ${
          categoriaSeleccionada === ''
            ? 'bg-pink-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Todos
      </button>
      {categorias.map((categoria) => (
        <button
          key={categoria}
          onClick={() => onSelectCategoria(categoria)}
          className={`px-4 py-2 rounded-lg transition ${
            categoriaSeleccionada === categoria
              ? 'bg-pink-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
}
