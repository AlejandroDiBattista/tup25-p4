"use client";

export default function ProductoCard({ producto }: any) {
  return (
<div className="flex gap-4 bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
      
      {/* Imagen */}
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/imagenes/${producto.id
          .toString()
          .padStart(4, "0")}.png`}
        alt={producto.nombre}
        className="w-32 h-32 object-cover rounded-md"
      />

      {/* Información */}
      <div className="flex flex-col justify-between flex-1">

        <div>
          <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
          <p className="text-sm text-gray-700 mt-1 leading-snug">{producto.descripcion}</p>
          <p className="text-xs text-gray-400 mt-1">Categoría: {producto.categoria}</p>
        </div>

        <p className="text-lg font-semibold text-gray-900">${producto.precio}</p>
      </div>

      {/* Botón y Stock */}
      <div className="flex flex-col items-end justify-between">
        <p className="text-gray-700 font-medium">Disponible: {producto.existencia}</p>


        <button
          className="bg-[#0A2540] hover:bg-[#0D3158] text-white py-2 px-4 rounded-md text-sm transition"

          onClick={() => {
            const usuarioId = localStorage.getItem("usuario_id");
            if (!usuarioId) return alert("Debe iniciar sesión para agregar al carrito.");

            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/carrito?usuario_id=${usuarioId}&producto_id=${producto.id}`, {
              method: "POST",
            }).then(() => window.location.reload());
          }}
        >
          Agregar al carrito
        </button>
      </div>

    </div>
  );
}
