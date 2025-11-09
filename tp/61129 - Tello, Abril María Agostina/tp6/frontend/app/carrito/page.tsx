export default function CarritoPage() {
  // Aquí deberías obtener el carrito del usuario desde el backend
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h2 className="text-2xl font-bold mb-6">Carrito de compras</h2>
      <div className="bg-white rounded shadow-md p-6 w-full max-w-lg">
        <p className="text-gray-500">Inicia sesión para ver y editar tu carrito.</p>
        {/* Aquí iría la lista de productos del carrito y los botones para modificar cantidades o eliminar */}
      </div>
    </div>
  );
}
