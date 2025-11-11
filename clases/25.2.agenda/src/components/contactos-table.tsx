"use client";

import { useState } from "react";
import { ListTable } from "./list-table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Plus } from "lucide-react";

interface ContactosTableProps {
  initialData: Record<string, any>[];
}

export function ContactosTable({ initialData }: ContactosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar contactos basado en el término de búsqueda
  const filteredData = initialData.filter((contacto) => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(contacto).some((value) =>
      String(value).toLowerCase().includes(searchLower)
    );
  });

  const handleAgregar = () => {
    // TODO: Implementar funcionalidad de agregar contacto
    console.log("Agregar nuevo contacto");
  };

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Campo de búsqueda */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Botón agregar */}
        <Button onClick={handleAgregar} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Contacto
        </Button>
      </div>

      {/* Tabla de contactos */}
      <ListTable data={filteredData} />
      
      {/* Mensaje cuando no hay resultados */}
      {filteredData.length === 0 && searchTerm && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron contactos que coincidan con "{searchTerm}"
        </div>
      )}
    </div>
  );
}
