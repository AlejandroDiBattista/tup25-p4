"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

interface ListTableProps {
  data: Record<string, any>[];
}

export function ListTable({ data }: ListTableProps) {
  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        No hay datos para mostrar
      </div>
    );
  }

  // Obtener las claves del primer objeto para las columnas
  const columns = Object.keys(data[0]);

  // Función para formatear el nombre de la columna
  const formatColumnName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1") // Agregar espacio antes de mayúsculas
      .replace(/_/g, " ") // Reemplazar guiones bajos con espacios
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Función para formatear el valor de la celda
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "-";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    if (typeof value === "boolean") {
      return value ? "Sí" : "No";
    }
    return String(value);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="font-semibold">
                {formatColumnName(column)}
              </TableHead>
            ))}
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={`${rowIndex}-${column}`}>
                  {formatCellValue(row[column])}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Link href={`/editar/${row.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
