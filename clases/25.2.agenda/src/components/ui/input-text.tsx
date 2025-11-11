import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes } from "react";

interface InputTextProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  name: string;
  label?: string;
  id?: string;
}

export function InputText({ name, label, id, ...props }: InputTextProps) {
  // Si no se pasa id, usar name
  const inputId = id || name;
  
  // Si no se pasa label, inferir de name
  const inputLabel = label || formatLabel(name);
  
  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{inputLabel}</Label>
      <Input id={inputId} name={name} {...props} />
    </div>
  );
}

// Función helper para formatear el label desde el name
function formatLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1") // Agregar espacio antes de mayúsculas
    .replace(/_/g, " ") // Reemplazar guiones bajos con espacios
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
