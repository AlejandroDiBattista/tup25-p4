"use client"

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useExamContext } from "@/contexts/exam-context"

export default function ResultadoPage() {
  const { legajo, result, loading, exam, error, resetError, repeatExam, newExam, clearState } = useExamContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!result && exam) {
      router.replace("/pregunta")
      return
    }

    if (!result && !exam) {
      router.replace("/")
    }
  }, [exam, loading, result, router])

  const handleRepeat = useCallback(async () => {
    resetError()
    const examNumber = await repeatExam()
    if (examNumber !== null) {
      router.push("/pregunta")
    }
  }, [repeatExam, resetError, router])

  const handleNewExam = useCallback(async () => {
    resetError()
    const examNumber = await newExam()
    if (examNumber !== null) {
      router.push("/pregunta")
    }
  }, [newExam, resetError, router])

  const handleChangeLegajo = useCallback(() => {
    clearState()
    router.replace("/")
  }, [clearState, router])

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Resultado</h1>
          <p className="text-sm text-muted-foreground">Consultá tu puntaje y decidí el siguiente paso.</p>
        </header>

        {error && (
          <Card className="border-destructive/50 bg-destructive/10 text-destructive">
            <CardContent className="py-3 text-sm font-medium">{error}</CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold">
                Resultado del examen #{result.examNumber}
              </CardTitle>
              <CardDescription>
                Legajo {legajo} • Puntaje obtenido: {result.score}/{result.total}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                {result.score === result.total ? (
                  <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    ¡Felicitaciones! Obtuviste el puntaje perfecto.
                  </p>
                ) : (
                  <p className="text-base font-medium text-foreground">
                    Buen trabajo. Podés repetir el examen para mejorar tu puntaje o intentar uno nuevo.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {result.score === result.total ? (
                  <Button type="button" onClick={handleNewExam} disabled={loading}>
                    Realizar un nuevo examen
                  </Button>
                ) : (
                  <>
                    <Button type="button" onClick={handleRepeat} disabled={loading}>
                      Repetir este examen
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleNewExam} disabled={loading}>
                      Tomar otro examen
                    </Button>
                  </>
                )}
                <Button type="button" variant="ghost" onClick={handleChangeLegajo} disabled={loading}>
                  Cambiar legajo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
