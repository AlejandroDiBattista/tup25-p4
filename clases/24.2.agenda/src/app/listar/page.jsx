import { traerContactos } from "@/lib/db";
import Link from "next/link";

const contactos = traerContactos();
export default function Listar() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <ul>
                {contactos.map((contacto) => (
                    <li key={contacto.id} className="mb-4 p-4 border rounded shadow">
                        <Link href={`/mostrar/${contacto.id}`} className="text-blue-600 hover:underline">
                            <h2 className="text-xl font-bold">{contacto.nombre} {contacto.apellido}</h2>
                            <p className="text-gray-600">Teléfono: {contacto.telefono}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}