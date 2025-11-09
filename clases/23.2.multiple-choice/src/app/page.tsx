"use client";

import { useMemo, useState } from "react";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { MultipleChoice, type MultipleChoiceOption } from "@/components/multiple-choice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import preguntas from "../../public/preguntas.json";

type RawQuestion = {
  numero: number;
  nivel: string;
  texto: string;
  respuestas: { texto: string }[];
  correcta: number;
};

type ExamQuestion = {
  question: RawQuestion;
  options: MultipleChoiceOption[];
  correctOptionId: string;
};

type ExamAnswer = {
  questionNumber: number;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
};

const TOTAL_QUESTIONS = 10;

const ALL_QUESTIONS: RawQuestion[] = (preguntas as RawQuestion[]).filter((question) => {
  const options = question.respuestas ?? [];
  const correctIndex = question.correcta;
  return (
    Array.isArray(options) &&
    options.length > 0 &&
    typeof correctIndex === "number" &&
    correctIndex >= 1 &&
    correctIndex <= options.length
  );
});

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function createExam(amount = TOTAL_QUESTIONS): ExamQuestion[] {
  const effectiveAmount = Math.min(amount, ALL_QUESTIONS.length);
  const selected = shuffle(ALL_QUESTIONS).slice(0, effectiveAmount);
  return selected.map((question) => {
    const options = question.respuestas.map((respuesta, index) => ({
      id: String(index + 1),
      text: respuesta.texto,
    }));
    return {
      question,
      options,
      correctOptionId: String(question.correcta),
    };
  });
}

export default function Home() {
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>(() => createExam());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(ExamAnswer | undefined)[]>([]);
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = examQuestions.length;

  const currentQuestion = examQuestions[currentQuestionIndex];

  const score = useMemo(
    () =>
      answers.reduce((total, answer) => {
        if (!answer?.isCorrect) {
          return total;
        }
        return total + 1;
      }, 0),
    [answers],
  );

  const handleAnswer = (option: MultipleChoiceOption) => {
    if (!currentQuestion) {
      return;
    }

    const isCorrect = option.id === currentQuestion.correctOptionId;

    setAnswers((previous) => {
      const next = [...previous];
      next[currentQuestionIndex] = {
        questionNumber: currentQuestion.question.numero,
        selectedOptionId: option.id,
        correctOptionId: currentQuestion.correctOptionId,
        isCorrect,
      };
      return next;
    });

    if (currentQuestionIndex >= examQuestions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex((index) => index + 1);
    }
  };

  const handleRestart = () => {
    setExamQuestions(createExam());
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (examQuestions.length === 0) {
    return (
      <div className="font-sans min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center p-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>No hay preguntas disponibles</CardTitle>
              <CardDescription>
                No se encontraron preguntas válidas en el archivo `preguntas.json`.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
              <Button onClick={handleRestart}>Reintentar</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Examen múltiple choice</CardTitle>
            <CardDescription>
              Diez preguntas elegidas al azar de tu banco de estudios. Selecciona la opción que creas
              correcta y avanza hasta completar el examen.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Pregunta {Math.min(currentQuestionIndex + 1, totalQuestions)} de {totalQuestions}
            </span>
            {currentQuestion && (
              <span className="font-medium text-foreground">Nivel {currentQuestion.question.nivel}</span>
            )}
            {showResults && (
              <span className="font-medium text-foreground">
                Puntaje final: {score} / {totalQuestions}
              </span>
            )}
          </CardContent>
        </Card>

        {showResults ? (
          <Card>
            <CardHeader>
              <CardTitle>Resultados del examen</CardTitle>
              <CardDescription>
                Respondiste correctamente {score} de {totalQuestions} preguntas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Completaste el examen con un puntaje de {score} sobre {totalQuestions}.</p>
              <p>Incorrectas: {Math.max(totalQuestions - score, 0)}.</p>
              <p>
                Porcentaje de aciertos: {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={handleRestart}>
                Nuevo examen
              </Button>
            </CardFooter>
          </Card>
        ) : (
          currentQuestion && (
            <MultipleChoice
              key={currentQuestion.question.numero}
              title={`Pregunta ${currentQuestionIndex + 1} · Nivel ${currentQuestion.question.nivel}`}
              question={currentQuestion.question.texto}
              options={currentQuestion.options}
              submitText={
                currentQuestionIndex === examQuestions.length - 1
                  ? "Finalizar examen"
                  : "Responder y continuar"
              }
              onAnswer={handleAnswer}
            />
          )
        )}
      </div>
    </div>
  );
}
