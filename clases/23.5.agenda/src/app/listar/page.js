import Link from "next/link"
import { headers } from "next/headers"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { SearchForm } from "./search-form"

async function fetchContacts(query) {
    const requestHeaders = headers()
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"
    const url = new URL("/api/contactos", `${protocol}://${host}`)

    if (query) {
        url.searchParams.set("q", query)
    }

    const response = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            accept: "application/json",
        },
    })

    if (!response.ok) {
        throw new Error("Error al obtener la lista de contactos")
    }

    return response.json()
}

export default async function ListarPage({ searchParams }) {
    const q = typeof searchParams?.q === "string" ? searchParams.q : ""

    let results = []
    let errorMessage = ""

    try {
        results = await fetchContacts(q)
    } catch (error) {
        errorMessage = error.message
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Lista de Contactos (SSR)</h1>

            <SearchForm initialQuery={q} />

            {errorMessage && (
                <p className="text-sm text-red-500" role="alert">
                    {errorMessage}
                </p>
            )}

            {!errorMessage && results.length === 0 ? (
                <p className="text-sm text-muted-foreground">No se encontraron contactos.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((contacto) => (
                            <TableRow key={contacto.id}>
                                <TableCell className="text-xl font-bold">
                                    {contacto.apellido} {contacto.nombre}
                                </TableCell>
                                <TableCell>{contacto.telefono}</TableCell>
                                <TableCell>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={`/mostrar/${contacto.id}`}>Ver</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
