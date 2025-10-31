"use client";

import { useState, useEffect } from "react";
import { ContactCreate } from "@/services/contacts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

interface ContactFormProps {
  initialData?: ContactCreate;
  onSubmit: (data: ContactCreate) => Promise<void>;
  onCancel: () => void;
  title: string;
}

export function ContactForm({ initialData, onSubmit, onCancel, title, }: ContactFormProps) {
  const [nombre, setNombre]     = useState(initialData?.nombre || "");
  const [apellido, setApellido] = useState(initialData?.apellido || "");
  const [email, setEmail]       = useState(initialData?.email || "");
  const [phones, setPhones]  = useState<string[]>( initialData?.phones || [""] );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPhone = () => {
    setPhones([...phones, ""]);
  };

  const handleRemovePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ nombre, apellido, email, phones: phones.filter((p) => p.trim() !== ""), });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldInput = ({ campo, valor, onChange }: { campo: string; valor: string; onChange: (e: any) => void; }) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={campo}>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Label>
        <Input id={campo} value={valor} onChange={(e) => onChange(e.target.value)} required />
      </div>
    );
  };

  const Aceptar = () => {
    return (
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Guardar"}
      </Button>
    );
  };

  const Cancelar = () => {
    return (
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} >
        Cancelar
      </Button>
    );
  };

  const PhoneInputRow: React.FC<{ value: string; onChange: (value: string) => void; onRemove: () => void; canRemove: boolean; }> = ({ value, onChange, onRemove, canRemove }) => (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Número de teléfono"
      />
      <Borrar index={0} disabled={!canRemove} onClick={onRemove} />
    </div>
  );

  const Borrar: React.FC<{ index?: number; disabled: boolean; onClick?: () => void }> = ({ index, disabled, onClick }) => {
    return (
      <Button type="button" variant="destructive" size="icon" onClick={onClick ? onClick : () => handleRemovePhone(index ?? 0)} disabled={disabled} >
        <X className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader> <CardTitle>{title}</CardTitle> </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldInput campo="nombre"   valor={nombre}   onChange={setNombre} />
          <FieldInput campo="apellido" valor={apellido} onChange={setApellido} />
          <FieldInput campo="email"    valor={email}    onChange={setEmail} />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Teléfonos</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddPhone} >
                <Plus className="h-4 w-4 mr-1" /> Agregar teléfono
              </Button>
            </div>
            <div className="space-y-2">
              {phones.map((phone, index) => (
                <PhoneInputRow key={index} value={phone} onChange={(value) => handlePhoneChange(index, value)} onRemove={() => handleRemovePhone(index)} canRemove={phones.length > 1} />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Cancelar />
            <Aceptar />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
