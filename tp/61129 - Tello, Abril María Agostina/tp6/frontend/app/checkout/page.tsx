export default function CheckoutPage() {
  // Aquí deberías obtener los datos del carrito y mostrar el resumen
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h2 className="text-2xl font-bold mb-6">Finalizar compra</h2>
      <div className="flex gap-8 w-full max-w-4xl">
        <div className="bg-white rounded shadow-md p-6 flex-1">
          <h3 className="font-semibold mb-4">Resumen del carrito</h3>
          {/* Aquí iría la lista de productos, subtotal, IVA, envío y total */}
          <p>Total a pagar: <span className="font-bold">$742.18</span></p>
        </div>
        <div className="bg-white rounded shadow-md p-6 flex-1">
          <h3 className="font-semibold mb-4">Datos de envío</h3>
          <form>
            <label className="block mb-2 text-sm font-medium">Dirección</label>
            <input type="text" className="w-full mb-4 p-2 border rounded" placeholder="Dirección" required />
            <label className="block mb-2 text-sm font-medium">Tarjeta</label>
            <input type="text" className="w-full mb-6 p-2 border rounded" placeholder="Tarjeta" required />
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded font-semibold active:scale-95">Confirmar compra</button>
          </form>
        </div>
      </div>
    </div>
  );
}
