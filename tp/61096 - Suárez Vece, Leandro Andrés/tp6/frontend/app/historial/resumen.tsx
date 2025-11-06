import { Card } from "@/components/ui/card";
import { RegistroCompra } from "./CardList";



interface DetalleCompraProps {
    compra: RegistroCompra;
}

export default function Resumen({ compra }: DetalleCompraProps) {
    return (
        <Card className="shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Detalle de la compra</h2>

            {/* Fila de Datos Generales */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4 text-sm">
                <div>
                    <p className="font-semibold">Compra #: {compra.id}</p>
                    <p>Dirección: {compra.direccion}</p>
                    <p>Tarjeta: {compra.tarjeta}</p>
                </div>
                <div className="text-right">
                    <p>Fecha: {compra.fecha}</p>
                </div>
            </div>

            {/* Productos */}
            <p className="font-bold mb-3">Productos</p>
            {compra.productos.map((producto, index) => (
                <div key={index} className="flex justify-between items-start mb-3">
                    <div className="flex-grow">
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-xs text-gray-500">Cantidad: {producto.cantidad}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p>${producto.precio.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">IVA: ${producto.iva.toFixed(2)}</p>
                    </div>
                </div>
            ))}

            {/* Totales */}
            <div className="mt-4 pt-4 border-t text-sm space-y-1 max-w-xs ml-auto">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">${compra.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>IVA:</span>
                    <span className="font-medium">${compra.ivaTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Envío:</span>
                    <span className="font-medium">${compra.envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                    <span>Total pagado:</span>
                    <span>${compra.total.toFixed(2)}</span>
                </div>
            </div>
        </Card>
    );
}