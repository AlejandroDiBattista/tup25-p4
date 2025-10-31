import { NextRequest, NextResponse } from "next/server";
import { normalizeString } from "@/lib/utils";

// import { getData, createData } from "@/lib/Data.js";
import { getData, createData } from "@/lib/DataSQLite";

// GET /api/contactos - Obtener todos los contactos
export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const q = url.searchParams.get("q")?.toLowerCase().trim();

	const contactos = await getData() as Record<string, any>[];

	if (!q) {
		return NextResponse.json(contactos);
	}

	const filtrados = contactos.filter((contacto) =>
		Object.values(contacto).some(valor => normalizeString(String(valor ?? "")).includes(normalizeString(q)))
	);

	return NextResponse.json(filtrados);
}

// POST /api/contactos - Crear un nuevo contacto
export async function POST(request: NextRequest) {
	const body = await request.json();
	const nuevoContacto = createData(body);
	return NextResponse.json(nuevoContacto, { status: 201 });
}
