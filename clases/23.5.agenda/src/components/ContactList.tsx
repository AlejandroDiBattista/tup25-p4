"use client"

import React from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Contacto } from "@/types/contacto"

interface Props {
  contactos: Contacto[]
}

export default function ContactList({ contactos = [] }: Props) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Apellido y Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contactos.map((contacto) => (
            <TableRow key={contacto.id}>
              <TableCell>{contacto.id}</TableCell>
              <TableCell>
                <div className="text-xl font-semibold">
                  {contacto.apellido} {contacto.nombre}
                </div>
              </TableCell>
              <TableCell>{contacto.telefono}</TableCell>
              <TableCell>
                <Link href={`/mostrar/${contacto.id}`} className="text-blue-500 hover:underline">Mostrar</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
