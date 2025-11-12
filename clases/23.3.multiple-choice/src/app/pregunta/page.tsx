"use client"

import { useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

import { MultipleChoiceQuestion } from "@/components/multiple-choice-question"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useExamContext } from "@/contexts/exam-context"

export default function PreguntaPage() {
  const {
    legajo,
    exam,
    currentQuestion,
    currentIndex,
    setCurrentIndex,
    answers,
    currentAnswer,
    answerQuestion,
    goToNextUnanswered,
    allAnswered,
    totalQuestions,
    answeredCount,
    loading,
    finalizeExam,
  } = useExamContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !exam) {
      router.replace("/")
    }
  }, [exam, loading, router])

  const handleAnswerChange = useCallback(
    (value: string) => {
      const parsedValue = Number.parseInt(value, 10)
      if (Number.isNaN(parsedValue)) return
      answerQuestion(currentIndex, parsedValue)
    },
    [answerQuestion, currentIndex]
  )

  const handleNext = useCallback(() => {
    if (!exam) return

    if (allAnswered) {
      const result = finalizeExam()
      if (result) {
        router.push("/resultado")
      }
      return
    }

    goToNextUnanswered()
  }, [allAnswered, exam, finalizeExam, goToNextUnanswered, router])

  const handleGoToQuestion = useCallback(
    (index: number) => {
      if (!exam || index < 0 || index >= exam.questions.length) return
      setCurrentIndex(index)
    },
    [exam, setCurrentIndex]
  )

  const questionOptions = useMemo(() => {
    if (!currentQuestion) return []

    return currentQuestion.respuestas.map((respuesta, index) => ({
      value: (index + 1).toString(),
      markdown: respuesta,
    }))
  }, [currentQuestion])

  const value = currentAnswer ? currentAnswer.toString() : ""

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pregunta</h1>
          <p className="text-sm text-muted-foreground">Respondé cada pregunta antes de finalizar el examen.</p>
        </header>

        {(!exam || !currentQuestion) && (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              {loading ? "Preparando el examen..." : "Seleccioná un examen para comenzar."}
            </CardContent>
          </Card>
        )}

        {exam && currentQuestion && (
          <>
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-semibold">
                  Legajo: <span className="font-normal text-muted-foreground">{legajo}</span>
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                  <span>Examen #{exam.examNumber}</span>
                  <span>•</span>
                  <span>
                    Pregunta {currentIndex + 1} de {totalQuestions}
                  </span>
                  <span>•</span>
                  <span>
                    Respondidas {answeredCount}/{totalQuestions}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>

            <MultipleChoiceQuestion
              prompt={currentQuestion.enunciado}
              options={questionOptions}
              value={value}
              onChange={handleAnswerChange}
            />

            <Card>
              <CardContent className="flex flex-wrap items-center gap-2 p-4 sm:p-6">
                {exam.questions.map((_question, index) => {
                  const isCurrent = index === currentIndex
                  const isAnswered = answers[index] !== undefined

                  return (
                    <Button
                      key={index}
                      type="button"
                      variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleGoToQuestion(index)}
                      disabled={loading}
                      className="min-w-9"
                    >
                      {index + 1}
                    </Button>
                  )
                })}

                <div className="ml-auto">
                  <Button type="button" onClick={handleNext} disabled={loading || (!allAnswered && !exam)}>
                    {allAnswered ? "Terminar" : "Siguiente"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
