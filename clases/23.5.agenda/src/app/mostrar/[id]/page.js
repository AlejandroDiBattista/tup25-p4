import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

async function getContacto(id) {
    const url = new URL(`/api/contactos/${id}`, 'http://localhost:3000').toString();
    const res = await fetch(url);
    return res.json();
}

const Celda = ({nombre, valor}) => (
    <TableRow>
        <TableCell className="font-normal">{nombre}</TableCell>
        <TableCell className="font-black text-xl">{valor}</TableCell>
    </TableRow>
);

export default async function MostrarPage({ params }) {
    const p = await params
    const id = parseInt(p.id, 10);
    const contacto = await getContacto(id);

    if (!contacto) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Contacto no encontrado</h1>
                <p>El contacto con ID {id} no existe.</p>
            </div>
        );
    }

        return (
            <div className="p-8">
               
                <Table className="table-auto w-min">
                <TableBody>
                    <Celda nombre="ID" valor={contacto.id} />
                    <Celda nombre="Nombre" valor={contacto.nombre} />
                    <Celda nombre="Apellido" valor={contacto.apellido} />
                    <Celda nombre="Teléfono" valor={contacto.telefono} />
                    <TableRow>
                        <TableCell className="font-normal">Acciones</TableCell>
                        <TableCell>
                            <Link href={`/editar/${contacto.id}`}>
                                <Button variant="outline" size="sm">Editar</Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}