"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { inferirLabel } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, } from "@/components/ui/form";
import type { Control, FieldPath, FieldValues, RegisterOptions, } from "react-hook-form";

export interface FmInputProps< TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues> > {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  placeholder?: string;
  type?: string;
  rules?: RegisterOptions<TFieldValues, TName>;
  inputClassName?: string;
  autoComplete?: string;
  // Cualquier otra prop del Input (excepto las que sobreescribimos)
  inputProps?: Omit<React.ComponentProps<typeof Input>, "name" | "placeholder" | "type">;
}

export function FmInput< TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues> >(props: FmInputProps<TFieldValues, TName>) {
  const { control, name, label, placeholder, type = "text", rules, inputClassName, autoComplete, inputProps, } = props;

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{inferirLabel(label, String(name))}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={inputClassName}
              {...inputProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FmInput;
