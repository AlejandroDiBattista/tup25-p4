"use client"

import { FormEvent, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { useExamContext } from "@/contexts/exam-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InicioPage() {
  const router = useRouter()
  const { legajo, setLegajo, startExam, loading, error, resetError, clearState } = useExamContext()
  const [formError, setFormError] = useState<string | null>(null)

  const handleLegajoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (formError) {
        setFormError(null)
      }
      if (error) {
        resetError()
      }
      setLegajo(event.target.value)
    },
    [error, formError, resetError, setLegajo]
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!legajo.trim()) {
        setFormError("Ingresá el legajo antes de comenzar.")
        return
      }

      const examNumber = await startExam()
      if (examNumber !== null) {
        router.push("/pregunta")
      }
    },
    [legajo, router, startExam]
  )

  const handleReset = useCallback(() => {
    clearState()
    setFormError(null)
  }, [clearState])

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Generador de Exámenes</h1>
          <p className="text-sm text-muted-foreground">
            Ingresá tu legajo para comenzar. Cada examen contiene 10 preguntas en formato multiple choice.
          </p>
        </header>

        {(error || formError) && (
          <Card className="border-destructive/50 bg-destructive/10 text-destructive">
            <CardContent className="py-3 text-sm font-medium">{error ?? formError}</CardContent>
          </Card>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CardHeader className="pb-0">
              <CardTitle>Inicio</CardTitle>
              <CardDescription>Necesitamos tu legajo para asignarte un examen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="legajo">Legajo</Label>
                <Input
                  id="legajo"
                  value={legajo}
                  onChange={handleLegajoChange}
                  placeholder="Ej: 12345"
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <Button type="button" variant="ghost" onClick={handleReset} disabled={loading}>
                  Limpiar
                </Button>
                <Button type="submit" className="sm:w-auto" disabled={loading}>
                  {loading ? "Generando examen..." : "Comenzar"}
                </Button>
              </div>

              <div className="flex justify-end">
                <Button asChild variant="outline" className="sm:w-auto">
                  <Link href="/impresion">Ver banco completo de preguntas</Link>
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </main>
  )
}
