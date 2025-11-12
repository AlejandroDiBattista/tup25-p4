import { contactos } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const id = parseInt(params.id);
    const contacto = contactos.find(c => c.id === id);

    if (!contacto) {
        return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(contacto);
}

export async function PUT(request, { params }) {
    const id = parseInt(params.id);
    const body = await request.json();

    const idx = contactos.findIndex(c => c.id === id);
    if (idx === -1) {
        return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 });
    }

    // Update in-memory (for demo purposes)
    contactos[idx] = { ...contactos[idx], ...body };

    return NextResponse.json(contactos[idx]);
}
