"use client";
import Editar from "@/components/Editar";
import { Button } from "@/components/ui/button";
import MarkdownViewer from "@/components/ui/markdown-viewer";
import MultipleChoice from "@/components/ui/mc-question";
import React, { useState } from "react";


export default function Home() {
  const [mostrar, setMostrar] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant={mostrar ? "destructive" : "default"} onClick={() => setMostrar(!mostrar)}>
        {mostrar ? "Ocultar" : "Mostrar"} Editar
      </Button>
      <MultipleChoice
        className="w-full max-w-2xl"
        question="¿Cuál es tu lenguaje favorito?"
        description="Elige solo uno"
        required
        options={[
          {
            value: "ts",
            text: "**TypeScript**\n\nTipado estático moderno.\n\n```ts\nconst suma = (a: number, b: number) => a + b;\n```",
          },
          { value: "py", text: "**Python**\n\nLenguaje versátil y legible.\n\n```py\ndef hola(nombre: str) -> str:\n    return f\"Hola {nombre}\"\n\nif __name__ == '__main__':\n    print(hola('Mundo'))\n```" },
          { value: "rs", text: "**Rust** _(Próximamente)_\n\nMemoria segura y alto rendimiento.\n\n```rust\nfn hola(nombre: &str) -> String {\n    format!(\"Hola {}\", nombre)\n}\n\nfn main() {\n    println!(\"{}\", hola(\"Mundo\"));\n}\n```"},
        ]}
      />

      <MultipleChoice
        className="w-full max-w-2xl mt-10"
        name="programResult"
        question="¿Qué imprime este programa en TypeScript?"
        description="Analiza el código y selecciona el resultado"
        required
        options={[
          {
            value: "code",
            disabled: true,
            text: "```ts\nfunction misterio(a: number[]): number {\n  return a.filter(x => x % 2 === 0)\n          .map(x => x * 2)\n          .reduce((s, x) => s + x, 0);\n}\n\nconsole.log(misterio([1, 2, 3, 4]));\n```"
          },
          { value: "8", text: "8" },
          { value: "12", text: "**12** (suma de 4 + 8)" },
          { value: "16", text: "16" },
          { value: "error", text: "Error en tiempo de ejecución" }
        ]}
      />

      {mostrar && <Editar />}
    </main>
  );
}
