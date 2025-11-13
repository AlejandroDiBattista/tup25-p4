import { contactos } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const url  = new URL(req.url);
        const qRaw = url.searchParams.get("q") || "";
        const q    = qRaw.toString().trim().toLowerCase();

        if (!q) return NextResponse.json(contactos);

        const results = contactos.filter((c) => {
            const full = `${c.apellido} ${c.nombre}`.toLowerCase();
            const fullRev = `${c.nombre} ${c.apellido}`.toLowerCase();
            return (
                full.includes(q) ||
                fullRev.includes(q) ||
                String(c.telefono).includes(q) ||
                String(c.id) === q
            );
        });

        return NextResponse.json(results);
    } catch (err) {
        return NextResponse.error();
    }
}
