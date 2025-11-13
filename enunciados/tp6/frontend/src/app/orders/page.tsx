export default function Orders() {
  const compras = [
    { id: 1, fecha: "2025-10-01", total: 30500 },
    { id: 2, fecha: "2025-09-15", total: 15000 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">Historial de compras</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        {compras.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center border-b py-2 text-gray-700"
          >
            <span>Compra #{c.id}</span>
            <span>{c.fecha}</span>
            <span>${c.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}