"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { cn } from "@/lib/utils";

export type MultipleChoiceOption = {
  id: string;
  text: string;
};

export type MultipleChoiceProps = {
  title?: string;
  question: string;
  options: MultipleChoiceOption[];
  onAnswer?: (selectedOption: MultipleChoiceOption) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
};

type ChoiceProps = {
  id: string;
  value: string;
  content: string;
  className?: string;
};

function Choice({ id, value, content, className }: ChoiceProps) {
  return (
    <div className={cn( "flex items-start space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50", className )} >
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex-1 cursor-pointer font-normal">
        <MarkdownRenderer content={content} showCard={false} className="text-sm" />
      </Label>
    </div>
  );
}

export function MultipleChoice({
  title,
  question,
  options,
  onAnswer,
  onCancel,
  submitText = "Confirmar respuesta",
  cancelText = "Cancelar",
}: MultipleChoiceProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [selectedId, setSelectedId] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedOption = options.find((option) => option.id === selectedId);
    if (selectedOption && onAnswer) {
      onAnswer(selectedOption);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="w-full space-y-0">
        {title ? (
          <CardHeader>
            <CardTitle id={titleId}>{title}</CardTitle>
          </CardHeader>
        ) : null}
        <CardContent className="space-y-4">
          <div id={descriptionId} className="text-sm text-muted-foreground">
            <MarkdownRenderer content={question} showCard={false} />
          </div>
          <RadioGroup
            value={selectedId}
            onValueChange={setSelectedId}
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={descriptionId}
            className="space-y-3"
          >
            {options.map((option) => {
              const inputId = `option-${option.id}`;
              return (
                <Choice key={option.id} id={inputId} value={option.id} content={option.text} />
              );
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          )}
          <Button type="submit" className="w-full sm:w-auto" disabled={!selectedId}>
            {submitText}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export { Choice };
export type { ChoiceProps };