"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * FnGroup: contenedor para agrupar campos de formulario en una grilla.
 * - Por defecto muestra una sola columna en móvil y N columnas (sm) hacia arriba.
 * - Usa clases estáticas para asegurar que Tailwind las detecte (no interpolación dinámica).
 */
export interface FnGroupProps {
  children: React.ReactNode;
  /** Número de columnas >= sm (1..4). Default: 2 */
  cols?: 1 | 2 | 3 | 4;
  /** Espaciado entre items (Tailwind class). Default: gap-4 */
  gapClassName?: string;
  /** Clases extra */
  className?: string;
  /** Etiqueta opcional del grupo (renderizada como legend si asFieldset=true) */
  label?: React.ReactNode;
  /** Descripción opcional debajo del label */
  description?: React.ReactNode;
  /** Envuelve en <fieldset> + <legend> para semántica accesible */
  asFieldset?: boolean;
}

export function FnGroup({
  children,
  cols = 2,
  gapClassName = "gap-4",
  className,
  label,
  description,
  asFieldset = false,
}: FnGroupProps) {
  const colClass = (() => {
    switch (cols) {
      case 1: return "sm:grid-cols-1";
      case 2: return "sm:grid-cols-2";
      case 3: return "sm:grid-cols-3";
      case 4: return "sm:grid-cols-4";
      default: return "sm:grid-cols-2";
    }
  })();

  const content = (
    <div className={cn("grid", gapClassName, colClass)}>
      {children}
    </div>
  );

  if (asFieldset) {
    return (
      <fieldset className={cn("space-y-2", className)}>
        {label && <legend className="font-medium text-sm leading-none">{label}</legend>}
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
        {content}
      </fieldset>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="font-medium text-sm leading-none">{label}</div>}
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
      {content}
    </div>
  );
}

export default FnGroup;
