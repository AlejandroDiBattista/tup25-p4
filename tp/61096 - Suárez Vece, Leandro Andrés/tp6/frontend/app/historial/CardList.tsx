import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Resumen from "./resumen";
// Importar las interfaces y datos ficticios definidos arriba
// import { RegistroCompra, compras } from './datos'; 


// Interfaz para el detalle de un producto en la compra
export interface ProductoComprado {
    nombre: string;
    cantidad: number;
    precio: number;
    iva: number;
}

// Interfaz para el registro de una compra
export interface RegistroCompra {
    id: number;
    fecha: string; // Formato: "DD/MM/YYYY, H:MM:SS a.m./p.m."
    total: number;
    direccion: string;
    tarjeta: string; // Formato: ****-****-****-1234
    productos: ProductoComprado[];
    subtotal: number;
    ivaTotal: number;
    envio: number;
}

// Datos Ficticios (Basados en su imagen)
const compras: RegistroCompra[] = [
    {
        id: 11,
        fecha: "31/10/2025, 5:15:20 a.m.",
        total: 144.73,
        direccion: "AV Central 4124",
        tarjeta: "****-****-****-1234",
        productos: [
            { nombre: "Camiseta ajustada premium", cantidad: 1, precio: 22.30, iva: 4.68 },
            { nombre: "Chaqueta algodon hombre", cantidad: 1, precio: 55.99, iva: 11.76 },
        ],
        subtotal: 78.29,
        ivaTotal: 16.44,
        envio: 50.00,
    },
    {
        id: 10,
        fecha: "31/10/2025, 5:14:40 a.m.",
        total: 742.18,
        direccion: "Calle Falsa 123",
        tarjeta: "****-****-****-5678",
        productos: [
            { nombre: "Mochila Fjallraven Foldsack", cantidad: 3, precio: 300.00, iva: 63.00 },
        ],
        subtotal: 600.00,
        ivaTotal: 126.00,
        envio: 16.18,
    },
];

export default function CardList() {
    // Estado para saber qué compra está seleccionada. Por defecto, la primera (compra #11)
    const [compraSeleccionada, setCompraSeleccionada] = useState<RegistroCompra>(compras[0]);

    // Función que simula la carga de datos (aquí simplemente actualizamos el estado)
    const seleccionarCompra = (compra: RegistroCompra) => {
        // En un caso real, aquí iría la llamada a la API:
        // const detalle = await api.getDetalleCompra(compra.id);
        setCompraSeleccionada(compra);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Mis compras</h1>

            {/* Contenedor Principal de 2 Columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA 1 (Izquierda): Historial de Compras (Maestro) */}
                <div className="lg:col-span-1 space-y-4">
                    {compras.map((compra) => (
                        <Card
                            key={compra.id}
                            // Estilo condicional: borde azul y fondo gris si está seleccionada
                            className={`cursor-pointer transition-all ${compra.id === compraSeleccionada.id
                                ? "border-blue-600 bg-gray-100 shadow-md"
                                : "border-gray-200 hover:border-blue-300"
                                }`}
                            onClick={() => seleccionarCompra(compra)} // Evento de clic
                        >
                            <CardContent className="p-4">
                                <p className="font-semibold text-base">Compra #: {compra.id}</p>
                                <p className="text-xs text-gray-600">{compra.fecha}</p>
                                <p className="text-lg font-bold mt-1">Total: ${compra.total.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* COLUMNA 2 (Derecha): Detalle de la Compra Seleccionada */}
                <div className="lg:col-span-2">
                    <Resumen compra={compraSeleccionada} />
                </div>
            </div>
        </div>
    );
}
