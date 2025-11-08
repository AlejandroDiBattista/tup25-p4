"use client";
import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Tipos
export interface MultipleChoiceOption {
  value: string;
  /** Texto markdown de la opción (puede incluir código) */
  text: string;
  disabled?: boolean;
}

export interface MultipleChoiceProps {
  /** Texto de la pregunta */
  question: string;
  /** Lista de opciones (valor + markdown) */
  options: MultipleChoiceOption[];
  /** Valor inicial (opcional) */
  defaultValue?: string;
  /** Callback al cambiar */
  onChange?: (value: string) => void;
  /** Nombre interno del campo (por defecto: "answer") */
  name?: string;
  /** Mostrar validación requerida */
  required?: boolean;
  /** Mensaje si está requerido y vacío */
  requiredMessage?: string;
  /** Clases extra raíz */
  className?: string;
  /** Descripción opcional debajo de la pregunta */
  description?: React.ReactNode;
  /** Deshabilitar todo el bloque */
  disabled?: boolean;
}

interface InternalFormValues {
  answer: string;
  [key: string]: any; // extensible
}

export function MultipleChoice({
  question,
  options,
  defaultValue,
  onChange,
  name = "answer",
  required,
  requiredMessage = "Este campo es obligatorio",
  className,
  description,
  disabled,
}: MultipleChoiceProps) {
  const form = useForm<InternalFormValues>({
    defaultValues: { [name]: defaultValue ?? "" },
  });

  const rules = required ? { required: requiredMessage } : undefined;

  return (
    <Form {...form}>
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {question}
            {required && <span className="text-destructive ml-1">*</span>}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs leading-relaxed">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <FormField
            control={form.control}
            name={name as any}
            rules={rules}
            render={({ field }: { field: { value: string; onChange: (v: string) => void } }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      onChange?.(val);
                    }}
                    disabled={disabled}
                    className="grid gap-2"
                  >
                    {options.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "group flex items-start gap-3 rounded-md border p-3 text-sm cursor-pointer transition-colors",
                          "hover:bg-accent/60 hover:border-primary/40",
                          opt.disabled && "opacity-50 cursor-not-allowed",
                          field.value === opt.value && "border-primary bg-primary/5"
                        )}
                      >
                        <RadioGroupItem value={opt.value} disabled={opt.disabled} />
                        <div className="flex flex-col gap-1 w-full text-left">
                          <MarkdownViewer
                            content={opt.text}
                            variant="raw"
                            className="prose prose-sm max-w-none prose-p:m-0 prose-code:before:hidden prose-code:after:hidden prose-pre:m-0 prose-pre:p-0 [&_pre]:overflow-x-auto [&_code]:text-xs"
                          />
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </Form>
  );
}

export default MultipleChoice;
