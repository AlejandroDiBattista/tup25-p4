"use client";

import { Contact } from "@/services/contacts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const router = useRouter();

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/contacts/${contact.id}`)} >
      <CardHeader>
        <CardTitle className="text-xl">
          {contact.nombre} {contact.apellido}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{contact.email}</span>
        </div>
        {contact.phones.length > 0 && (
          <div className="space-y-1">
            {contact.phones.map((phone) => (
              <div key={phone.id} className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>{phone.number}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
