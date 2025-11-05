import { ToolLoopAgent, tool , stepCountIs} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// Herramienta calculadora
const calculadora = tool({
  description: "Evalúa expresiones matemáticas",
  inputSchema: z.object({
    expression: z.string().describe("Expresión aritmética")
  }),
  execute: async ({ expression }) => {
    try {
      console.log(`🔢 Calculando: ${expression}`);
      return { result: eval(expression) };
    } catch (error) {
      return { error: error.message };
    }
  }
});

// Agente
const agente = new ToolLoopAgent({
  model: openai("gpt-5-mini"),
  instructions: `
Eres un agente autónomo que analiza la variación del dólar argentino.

CONTEXTO:
- "Dólar" = Dólar Mayorista BCRA (USD/ARS oficial MULC)
- Fuente: BCRA
- Variación del mes: primer día vs último día hábil

LÍMITE ESTRICTO:
- MÁXIMO 2 búsqueda web (no más)
- Total máximo: 3 pasos

PROHIBIDO:
- NO hagas múltiples búsquedas
- NO solicites aclaraciones
- NO preguntes tipo de dólar
- NO uses datos ficticios
- NO expliques tu razonamiento en la respuesta final
- NO muestres las fuentes utilizadas
  `,
  tools: { 
    calculadora,
    web_search: openai.tools.webSearch({})
  },
  stopWhen: stepCountIs(3), // Allow up to 3 steps
});

// Ejecución
const prompt = process.argv[2] || "¿Cuál fue la variación del dólar en octubre de 2025?";

console.log("🤖 Agente iniciado...");
console.log(`📝 Consulta: ${prompt}`);
console.log(`⚠️  Nota: La búsqueda web puede tardar 30-60 segundos... (Son las ${new Date().toLocaleTimeString()})\n`);

const { text, steps } = await agente.generate({ prompt });

console.log("\n" + "=".repeat(70));
console.log("📊 RESULTADO:");
console.log(text);
console.log(`\n✅ Análisis completado en ${steps.length} pasos (Termino a las ${new Date().toLocaleTimeString()})\n`);

