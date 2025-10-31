"use client";

import { contactsAPI, type ContactCreate } from "@/services/contacts";
import { ContactForm } from "@/components/ContactForm";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useRouter } from "next/navigation";

export default function NewContactPage() {
  const router = useRouter();

  const handleSubmit = async (data: ContactCreate): Promise<void> => {
    try {
      await contactsAPI.create(data);
      router.push("/");
    } catch (error) {
      console.error("Error al crear contacto:", error);
      alert("Error al crear el contacto");
    }
  };

  const handleCancel = (): void => { router.push("/"); };

  return (
    <ScreenContainer>
      <ContactForm title="Nuevo Contacto" onSubmit={handleSubmit} onCancel={handleCancel} />
    </ScreenContainer>
  );
}
