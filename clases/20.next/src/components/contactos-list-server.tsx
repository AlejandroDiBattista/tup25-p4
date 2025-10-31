import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Edit } from "lucide-react";
import Link from "next/link";
import { getData, createData } from "@/lib/DataSQLite";

import * as Http from "@/lib/http";

interface ContactosListServerProps {
  searchTerm?: string;
}

async function getContactos(searchTerm?: string) {
  const params = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";
  const contactos = getData()
  return contactos || [];
}

export async function ContactosListServer({ searchTerm }: ContactosListServerProps) {
  const contactos = await getContactos(searchTerm);

  if (contactos.length === 0 && searchTerm) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron contactos que coincidan con "{searchTerm}"
      </div>
    );
  }

  if (contactos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay contactos disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contactos.map((c: any) => {
            const id = c.id ?? c._id ?? "";
            return (
              <TableRow key={id || `${c.nombre}-${c.apellido}`}>
                <TableCell>{c.nombre ?? "-"} {c.apellido ?? "-"}</TableCell>
                <TableCell>{c.email ?? "-"}</TableCell>
                <TableCell>{c.telefono ?? c.phone ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/editar/${id}`} className="inline-flex items-center text-sm text-blue-600 hover:underline" >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
