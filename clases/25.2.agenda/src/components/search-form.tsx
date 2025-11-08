"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Actualizar el valor local cuando cambian los searchParams (ej: botón atrás del navegador)
  useEffect(() => {
    const urlSearch = searchParams.get('q') || '';
    if (urlSearch !== searchValue) {
      setSearchValue(urlSearch);
    }
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value); // Actualizar el estado local inmediatamente
    
    // Limpiar el timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Hacer el debounce de 300ms antes de actualizar la URL
    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value) {
          params.set('q', value);
        } else {
          params.delete('q');
        }
        
        router.push(`/?${params.toString()}`);
      });
    }, 300);
  };

  return (
    <div className="relative w-full sm:w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
      <Input 
        type="text" 
        name="search" 
        placeholder="Buscar contactos..." 
        value={searchValue}
        onChange={handleSearch}
        className={`pl-10 ${isPending ? 'opacity-50' : ''}`}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
