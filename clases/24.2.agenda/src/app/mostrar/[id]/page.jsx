import { traerContactoPorId } from "@/lib/db";
import { Phone } from "lucide-react";
import Link from "next/link";
export default function Mostrar({params}) {
    const {id} = params;
    const contacto = traerContactoPorId(id);
    return (
        <main className="flex min-h-screen items-center justify-center">
            {contacto ? (
                <div>
                    <h2 className="text-2xl font-semibold">
                        {contacto.nombre} {contacto.apellido}
                    </h2>
                    <p className="flex items-center gap-2 text-gray-600">
                        <Phone size={20} className="text-gray-500" />
                        Teléfono: {contacto.telefono}
                    </p>
                    <Link
                        href={`/editar/${id}`}
                        className="text-blue-600 hover:underline"
                    >
                        Editar
                    </Link>
                </div>
            ) : (
                <p className="text-3xl font-bold text-red-600">
                    Contacto no encontrado
                </p>
            )}
        </main>
    )
}