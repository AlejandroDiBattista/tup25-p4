export default function ComprasPage() {
  // Aquí deberías obtener el historial de compras del usuario desde el backend
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h2 className="text-2xl font-bold mb-6">Mis compras</h2>
      <div className="flex gap-8 w-full max-w-4xl">
        <div className="bg-white rounded shadow-md p-6 flex-1">
          <h3 className="font-semibold mb-4">Compras</h3>
          {/* Aquí iría la lista de compras con fecha y total */}
        </div>
        <div className="bg-white rounded shadow-md p-6 flex-1">
          <h3 className="font-semibold mb-4">Detalle de la compra</h3>
          {/* Aquí iría el detalle de la compra seleccionada */}
        </div>
      </div>
    </div>
  );
}
