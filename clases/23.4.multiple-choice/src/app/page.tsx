import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Pregunta = {
  numero: number;
  enunciado: string;
  respuestas: string[];
  correcta: number;
};

function formatMarkdownToPlainText(markdown: string) {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`{3}[\s\S]*?`{3}/g, (match) =>
      match.replace(/`{3}\w*\n?|`{3}$/g, "")
    )
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\r\n/g, "\n")
    .trim();
}

async function fetchPreguntas(): Promise<Pregunta[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ?? (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT ?? 3000}`);
  const sanitizedBaseUrl = baseUrl.replace(/\/$/, "");

  const response = await fetch(`${sanitizedBaseUrl}/api/preguntas`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener las preguntas del API");
  }

  return response.json();
}

export default async function Home() {
  let preguntas: Pregunta[] = [];
  let error: string | null = null;

  try {
    preguntas = await fetchPreguntas();
  } catch (err) {
    error = err instanceof Error ? err.message : "Ocurrió un error inesperado";
  }

  if (error) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <Card className="max-w-lg border-destructive/60 bg-destructive/5 text-destructive">
          <CardHeader>
            <CardTitle>Algo salió mal</CardTitle>
            <CardDescription className="text-destructive/80">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Listado de preguntas</h1>
        <p className="text-muted-foreground">
          Estas preguntas se obtienen directamente desde el endpoint <code>/api/preguntas</code>.
        </p>
      </div>

      <div className="grid gap-4">
        {preguntas.map((pregunta) => (
          <Card key={pregunta.numero}>
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  #{pregunta.numero}
                </span>
                Pregunta {pregunta.numero}
              </CardTitle>
              <CardDescription className="whitespace-pre-wrap text-base text-foreground">
                {formatMarkdownToPlainText(pregunta.enunciado)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {pregunta.respuestas.map((respuesta, index) => (
                  <li
                    key={`${pregunta.numero}-${index}`}
                    className="flex gap-3 rounded-lg border bg-muted/40 p-3 text-sm text-foreground"
                  >
                    <span className="font-semibold text-muted-foreground">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="whitespace-pre-wrap">
                      {formatMarkdownToPlainText(respuesta)}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
