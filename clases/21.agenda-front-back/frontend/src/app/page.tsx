"use client";

import { useState, useEffect, useCallback } from "react";
import { contactsAPI, type Contact } from "@/services/contacts";
import { ContactCard } from "@/components/ContactCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { InputSearch } from "@/components/InputSearch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewContactButtonProps {
  onClick: () => void;
}

interface ContactMessageProps {
  search: string;
  contacts: Contact[];
}

const NewContactButton = ({ onClick }: NewContactButtonProps) => (
  <Button onClick={onClick}>
    <Plus className="h-4 w-4 mr-2" />
    Nuevo Contacto
  </Button>
);


const ContactMessage = ({ search, contacts }: ContactMessageProps) => {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {search
          ? "No se encontraron contactos con ese criterio"
          : "No hay contactos. ¡Crea tu primer contacto!"}
      </div>
    );
  }
  return null;
};

const LoadingMessage = () => (
  <div className="text-center py-12 text-muted-foreground">
    Cargando contactos...
  </div>
);

export default function HomePage() {
  const router = useRouter();
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contactsAPI.readAll(search || undefined);
      setContacts(data.contacts);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  return (
    <ScreenContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Agenda de Contactos</h1>
          <NewContactButton onClick={() => router.push("/contacts/new")} />
        </div>

        {/* Search */}
        <InputSearch
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre, apellido o email..."
        />

        {/* Contacts Grid */}
        {isLoading ? <LoadingMessage /> : <ContactMessage search={search} contacts={contacts} />}
        {contacts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
