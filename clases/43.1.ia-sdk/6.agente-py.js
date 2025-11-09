import { Experimental_Agent as Agent, stepCountIs, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { promises as fs } from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import chalk from "chalk";
import { stdin as input, stdout as output } from "node:process";
import { z } from "zod";

const model = openai("gpt-5-mini");
const workspaceRoot = process.cwd();
const rl = readline.createInterface({ input, output });

async function preguntar(mensaje) {
  try {
    const respuesta = await rl.question(mensaje);
    return respuesta.trim();
  } catch {
    return null;
  }
}

const systemPrompt = `
Eres un generador de scripts Python.

Herramientas: leer_archivo, guardar_script

SIEMPRE debes:
1. Generar código Python (3-10 líneas) en bloques \`\`\`python
2. Crear un nombre descriptivo (1-3 palabras con '-')
3. Preguntar: "¿Guardar en src/[nombre].py?"
4. Si confirma (sí/s/si/ok/dale), usar guardar_script(ruta="src/[nombre].py", codigo)

Estilo del código:
- Directo, sin funciones innecesarias
- Operaciones inline cuando sea posible
- Sin docstrings extensos
`;

const herramientas = {
  leer_archivo: tool({
    description: "Lee el contenido de un archivo del workspace",
    inputSchema: z.object({ ruta: z.string() }),
    execute: async ({ ruta }) => {
      const absoluta  = path.resolve(workspaceRoot, ruta);
      const contenido = await fs.readFile(absoluta, "utf-8");
      return { contenido };
    },
  }),
  guardar_script: tool({
    description: "Guarda un script Python en el workspace (sobrescribe si existe)",
    inputSchema: z.object({
      ruta: z.string().describe("Ruta relativa donde guardar el script"),
      codigo: z.string().describe("Código Python a guardar"),
    }),
    execute: async ({ ruta, codigo }) => {
      const absoluta = path.resolve(workspaceRoot, ruta);
      await fs.mkdir(path.dirname(absoluta), { recursive: true });
      await fs.writeFile(absoluta, codigo, "utf-8");
      return { guardado: true, bytes: codigo.length };
    },
  }),
};

const agente = new Agent({
  model,
  system: systemPrompt.trim(),
  tools: herramientas,
  stopWhen: stepCountIs(10),
});

async function iniciarConversacion() {
  console.log(chalk.blue("🤖 Generador de scripts Python\n"));
  const mensajes = [];

  while (true) {
    const entrada = await preguntar("🙎: ");
    if (entrada === null || entrada.toLowerCase() === "salir") {
      rl.close();
      break;
    }
    if (!entrada) continue;

    mensajes.push({ role: "user", content: entrada });

    const resultado = await agente.generate({ messages: mensajes });

    console.log(`\n🤖 ${resultado.text}\n`);
    mensajes.push({ role: "assistant", content: resultado.text });
  }
}

await iniciarConversacion();

