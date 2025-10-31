import { NextRequest, NextResponse } from "next/server";
// import { getDataById, updateData, deleteData } from "@/lib/Data.js";
import { getDataById, updateData, deleteData } from "@/lib/DataSQLite.js";


// GET /api/contactos/:id - Obtener un contacto por ID
export async function GET( request: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  const contacto = getDataById(id);
  
  if (!contacto) {
    return NextResponse.json(
      { error: "Contacto no encontrado" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(contacto);
}

// PUT /api/contactos/:id - Actualizar un contacto
export async function PUT( request: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  const data = await request.json();
  
  updateData(id, data);
  const contactoActualizado = getDataById(id);
  
  if (!contactoActualizado) {
    return NextResponse.json(
      { error: "Contacto no encontrado" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(contactoActualizado);
}

// DELETE /api/contactos/:id - Eliminar un contacto
export async function DELETE( request: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  const contacto = getDataById(id);
  
  if (!contacto) {
    return NextResponse.json(
      { error: "Contacto no encontrado" },
      { status: 404 }
    );
  }
  
  deleteData(id);
  return NextResponse.json({ message: "Contacto eliminado exitosamente" });
}
