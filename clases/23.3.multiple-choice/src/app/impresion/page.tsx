"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Question } from "@/types/exam"

const remarkPlugins = [remarkGfm]
const rehypePlugins = [rehypeHighlight]

function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm max-w-none text-foreground">
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default function ImpresionPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadQuestions = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/preguntas.json", { cache: "no-store" })
        if (!response.ok) {
          throw new Error("No se pudieron cargar las preguntas.")
        }

        const data = (await response.json()) as Question[]
        if (isMounted) {
          setQuestions(data)
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Ocurrió un error inesperado."
          setError(message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadQuestions()

    return () => {
      isMounted = false
    }
  }, [])

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }, [])

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-2 print:hidden">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vista para imprimir</h1>
          <p className="text-sm text-muted-foreground">
            Imprimí el banco completo de preguntas para practicar o compartir sin necesidad de generar un examen previo.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handlePrint} disabled={loading}>
              Imprimir
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pregunta">Ir al examen</Link>
            </Button>
          </div>
        </header>

        {error && (
          <Card className="border-destructive/50 bg-destructive/10 text-destructive print:hidden">
            <CardContent className="py-3 text-sm font-medium">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <Card className="print:hidden">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Cargando preguntas...
            </CardContent>
          </Card>
        ) : (
          <section className="">

            <div className="space-y-8">
              {questions.map((question, index) => (
                <article key={question.numero ?? index} className="space-y-4 break-inside-avoid">
                  

                  <Card className="border-border/80">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                    </CardTitle>
                      <div className="font-semibold text-foreground flex gap-2">
                        <span className="text-2xl">{index + 1}.</span>
                        <span> <Markdown>{question.enunciado}</Markdown> </span>
                      </div>
                    </CardHeader>
                    <hr />
                    <br />
                    <CardContent className="space-y-1 text-sm text-foreground">
                      {question.respuestas.map((respuesta, respuestaIndex) => (
                        <div key={respuestaIndex} className="flex gap-2">
                          <span className="font-bold">{"abc"[respuestaIndex]}) </span>
                          <span> <Markdown>{respuesta}</Markdown> </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
