"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface MultipleChoiceProps {
  question: string;
  options: string[];
  questionNumber?: number;
  onAnswer?: (selectedOption: string, selectedIndex: number) => void;
  title?: string;
  allowMultipleAttempts?: boolean;
}

export default function MultipleChoice({
  question,
  options,
  questionNumber,
  onAnswer,
  title = "Pregunta de Examen",
  allowMultipleAttempts = true
}: MultipleChoiceProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState(false);

  // Función helper para obtener texto plano del markdown (simplificado)
  const getPlainText = (markdown: string): string => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic
      .replace(/`(.*?)`/g, '$1')       // Remove inline code
      .replace(/#{1,6}\s+/g, '')       // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
      .replace(/\n/g, ' ')             // Replace newlines with spaces
      .trim();
  };

  const handleValueChange = (value: string) => {
    if (!hasAnswered || allowMultipleAttempts) {
      setSelectedValue(value);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedValue) {
      setHasAnswered(true);
      
      if (onAnswer) {
        const selectedIndex = parseInt(selectedValue);
        onAnswer(options[selectedIndex], selectedIndex);
      }
    }
  };

  const handleReset = () => {
    setSelectedValue("");
    setHasAnswered(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {questionNumber && (
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              Pregunta {questionNumber}
            </span>
          )}
          {title}
        </CardTitle>
        <CardDescription className="mt-4">
          <MarkdownRenderer 
            content={question} 
            className="text-lg font-medium text-foreground"
          />
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <RadioGroup 
          value={selectedValue} 
          onValueChange={handleValueChange}
          disabled={hasAnswered && !allowMultipleAttempts}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 border rounded-lg transition-all ${
                selectedValue === index.toString()
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${
                hasAnswered && !allowMultipleAttempts ? 'cursor-not-allowed opacity-75' : ''
              }`}
            >
              <div className="flex items-center pt-0.5">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              </div>
              <Label 
                htmlFor={`option-${index}`} 
                className="flex-1 cursor-pointer text-sm leading-relaxed"
              >
                <div className="flex items-start gap-2">
                  <span className="font-medium shrink-0 mt-0.5">
                    {String.fromCharCode(65 + index)})
                  </span>
                  <div className="flex-1">
                    <MarkdownRenderer 
                      content={option} 
                      className="text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    />
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedValue || (hasAnswered && !allowMultipleAttempts)}
            className="flex-1"
          >
            {hasAnswered ? 'Respuesta Enviada' : 'Enviar Respuesta'}
          </Button>
          
          {allowMultipleAttempts && hasAnswered && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Cambiar Respuesta
            </Button>
          )}
        </div>

        {hasAnswered && selectedValue && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Respuesta seleccionada:</strong> {String.fromCharCode(65 + parseInt(selectedValue))} - {getPlainText(options[parseInt(selectedValue)])}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}