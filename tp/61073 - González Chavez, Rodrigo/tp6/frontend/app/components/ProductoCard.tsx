"use client"
// import { Producto } from '../types';
// import Image from 'next/image';

// interface ProductoCardProps {
//   producto: Producto;
// }

// export default function ProductoCard({ producto }: ProductoCardProps) {
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//       <div className="relative h-64 bg-gray-100">
//         <Image
//           src={`${API_URL}/imagenes/${producto.imagen}`}
//           alt={producto.nombre || "Imágen del producto"}
//           fill
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           className="object-contain p-4"
//           unoptimized
//         />
//       </div>
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
//           {producto.nombre}
//         </h3>
//         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//           {producto.descripcion}
//         </p>
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//             {producto.categoria}
//           </span>
//           <div className="flex items-center gap-1">
//             <span className="text-yellow-500">★</span>
//             <span className="text-sm text-gray-700">{producto.valoracion}</span>
//           </div>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-2xl font-bold text-blue-600">
//             ${producto.precio}
//           </span>
//           <span className="text-xs text-gray-500">
//             Stock: {producto.existencia}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

import Image from "next/image"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { Producto } from "../types"
import { useAuthStore } from "../store/useAuthStore"
import { agregarAlCarrito } from "../services/carrito"
import { useCarritoStore } from "../store/useCarritoStore"

interface Props {
  producto: Producto
}

export default function ProductoCard({ producto }: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const { token } = useAuthStore()
  const {agregar} = useCarritoStore()

  const handleAgregar = async () => {
    if (!token) {
      toast.error("Inicia sesión para agregar al carrito")
      return
    }
    agregar(producto)
    await agregarAlCarrito(producto.id, token)
    toast.success("Producto agregado al carrito")
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image
          src={`${API_URL}/imagenes/${producto.imagen}`}
          alt={producto.nombre}
          fill
          unoptimized
          className="object-contain p-4"
        />
      </div>

      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-lg">{producto.nombre}</h3>
        <p className="text-gray-500 text-sm">{producto.descripcion}</p>
        <p className="text-sm text-gray-400">
          Categoría: {producto.categoria}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="font-semibold text-lg text-black-700">
          ${producto.precio}
        </p>
        <p className="text-sm text-gray-500">
          Disponible: {producto.existencia}
        </p>
        <Button
          onClick={handleAgregar}
          disabled={producto.existencia === 0}
          className="bg-gray-800 hover:bg-gray-950"
        >
          {producto.existencia === 0 ? "Agotado" : "Agregar al carrito"}
        </Button>
      </div>
    </div>
  );
}