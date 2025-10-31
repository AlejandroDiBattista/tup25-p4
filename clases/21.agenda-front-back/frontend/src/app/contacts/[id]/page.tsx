"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { contactsAPI, type Contact, type ContactCreate } from "@/services/contacts";
import { ContactForm } from "@/components/ContactForm";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";

function DeleteButton({ onDelete, isDeleting }: { onDelete: () => void; isDeleting: boolean }) {
  return (
    <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4 mr-2" />
      {isDeleting ? "Eliminando..." : "Eliminar Contacto"}
    </Button>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <Button variant="ghost" onClick={onBack}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Volver
    </Button>
  );
}

export default function EditContactPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const contactId = Number(params.id);

  const loadContact = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contactsAPI.read(contactId);
      setContact(data);
    } catch (error) {
      console.error("Error al cargar contacto:", error);
      alert("Error al cargar el contacto");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [contactId, router]);

  useEffect(() => { loadContact(); }, [loadContact]);

  const handleSubmit = async (data: ContactCreate): Promise<void> => {
    try {
      await contactsAPI.update(contactId, data);
      router.push("/");
    } catch (error) {
      console.error("Error al actualizar contacto:", error);
      alert("Error al actualizar el contacto");
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm("¿Estás seguro de eliminar este contacto?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await contactsAPI.delete(contactId);
      router.push("/");
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      alert("Error al eliminar el contacto");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = (): void => { router.push("/"); };

  if (isLoading) {
    return (
      <ScreenContainer>
        <div className="text-center">Cargando contacto...</div>
      </ScreenContainer>
    );
  }

  if (!contact) { return null; }

  return (
    <ScreenContainer>
      <div className="mb-6 flex items-center justify-between">
        <BackButton onBack={() => router.push("/")} />
        <DeleteButton onDelete={handleDelete} isDeleting={isDeleting} />
      </div>

      <ContactForm
        title="Editar Contacto"
        initialData={{
          nombre: contact.nombre,
          apellido: contact.apellido,
          email: contact.email,
          phones: contact.phones.map((p) => p.number),
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </ScreenContainer>
  );
}
