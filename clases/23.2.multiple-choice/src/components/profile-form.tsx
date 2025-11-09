"use client";

import { useEffect, useState, type ComponentProps, type ReactNode } from "react";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ProfileFormState = {
  firstName: string;
  lastName: string;
  phone: string;
};

const defaultProfile: ProfileFormState = {
  firstName: "Ana",
  lastName: "Gómez",
  phone: "+54 11 5555-1234",
};

type ProfileFormProps = {
  initialProfile?: ProfileFormState;
  onSubmit?: (values: ProfileFormState) => void | Promise<void>;
  onCancel?: () => void;
};

type EditFieldProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  containerClassName?: string;
} & Omit<ComponentProps<typeof Input>, "id">;

function EditField({
  id,
  label,
  hint,
  containerClassName,
  className,
  ...inputProps
}: EditFieldProps) {
  return (
    <div className={cn("grid gap-2", containerClassName)}>
      <Label htmlFor={id}>{label}</Label>
      {hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
      <Input id={id} className={className} {...inputProps} />
    </div>
  );
}

export function ProfileForm({
  initialProfile = defaultProfile,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [formValues, setFormValues] = useState<ProfileFormState>(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormValues(initialProfile);
    setIsSubmitting(false);
  }, [initialProfile]);

  const handleChange = (field: keyof ProfileFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit?.(formValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Editar perfil</CardTitle>
          <CardDescription>
            Actualizá tu nombre, apellido y teléfono de contacto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditField
            id="firstName"
            label="Nombre"
            value={formValues.firstName}
            onChange={handleChange("firstName")}
            placeholder="Ingresá tu nombre"
            autoComplete="given-name"
            required
          />
          <EditField
            id="lastName"
            label="Apellido"
            value={formValues.lastName}
            onChange={handleChange("lastName")}
            placeholder="Ingresá tu apellido"
            autoComplete="family-name"
            required
          />
          <EditField
            id="phone"
            label="Teléfono"
            value={formValues.phone}
            onChange={handleChange("phone")}
            placeholder="Ej. +54 11 5555-1234"
            autoComplete="tel"
            required
          />
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onCancel?.()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export { EditField };
export type { EditFieldProps };
