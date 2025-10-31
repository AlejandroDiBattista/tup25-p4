import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ContactosListServer } from "@/components/contactos-list-server";
import { SearchForm } from "@/components/search-form";
import { Skeleton } from "@/components/ui/skeleton";

// Componente de loading para Suspense
function ContactosLoading() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export default async function Home({ searchParams, }: { searchParams: Promise<{ q?: string }>; }) {
  const { q } = await searchParams; // Await searchParams en Next.js 15
  const searchTerm = q || '';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Lista de Contactos
      </h1>
      
      <div className="space-y-4">
        {/* Barra de acciones */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Campo de búsqueda - Cliente Component */}
          <SearchForm />

          {/* Botón agregar */}
          <Link href="/crear">
            <Button type="button" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> 
              Agregar Contacto
            </Button>
          </Link>
        </div>

        {/* Lista de contactos - Server Component con Suspense */}
        <Suspense key={searchTerm} fallback={<ContactosLoading />}>
          <ContactosListServer searchTerm={searchTerm} />
        </Suspense>
      </div>
    </div>
  );
}
