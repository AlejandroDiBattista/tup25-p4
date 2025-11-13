import { getContactoById } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

export default function MostrarContacto({ params }) {
    const contacto = getContactoById(parseInt(params.id));
    
    if (!contacto) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Contacto no encontrado</h1>
                <p className="text-gray-600">El contacto con ID {params.id} no existe.</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Detalles del Contacto</h1>
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campo</TableHead>
                            <TableHead>Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Nombre</TableCell>
                            <TableCell>{contacto.nombre} {contacto.apellido}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Teléfono</TableCell>
                            <TableCell>{contacto.telefono}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}