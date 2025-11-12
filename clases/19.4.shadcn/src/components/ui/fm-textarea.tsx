"use client";
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { inferirLabel } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

export interface FmTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  placeholder?: string;
  rules?: RegisterOptions<TFieldValues, TName>;
  textAreaClassName?: string;
  autoResize?: boolean; // simple auto-resize
  inputProps?: Omit<React.ComponentProps<typeof Textarea>, "name" | "placeholder">;
}

export function FmTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  rules,
  textAreaClassName,
  autoResize = true,
  inputProps,
}: FmTextareaProps<TFieldValues, TName>) {
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (!autoResize || !ref.current) return;
    const el = ref.current;
    const handler = () => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };
    handler();
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, [autoResize]);

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{inferirLabel(label, String(name))}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              ref={(node) => {
                field.ref(node);
                ref.current = node;
              }}
              placeholder={placeholder}
              className={textAreaClassName}
              {...inputProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FmTextarea;
