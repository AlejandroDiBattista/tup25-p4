import { contactos } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

type Contacto = {
  id: number
  nombre: string
  apellido: string
  telefono: string
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const numericId = parseInt(id, 10)
  const contacto = contactos.find((c: Contacto) => c.id === numericId)

  if (!contacto) {
    return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
  }

  return NextResponse.json(contacto)
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const numericId = parseInt(id, 10)
  const body = await request.json()

  const idx = contactos.findIndex((c: Contacto) => c.id === numericId)
  if (idx === -1) {
    return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
  }

  // Update in-memory (for demo purposes)
  contactos[idx] = { ...contactos[idx], ...body }

  return NextResponse.json(contactos[idx])
}
