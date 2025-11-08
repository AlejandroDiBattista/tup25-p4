import { ToolLoopAgent, tool , stepCountIs} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const model = openai("gpt-5-mini");
const instructions = `
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
  `
// Herramienta calculadora
const calculadora = tool({
  description: "Evalúa expresiones matemáticas",
  inputSchema: z.object({
    expression: z.string().describe("Expresión aritmética")
  }),
  execute: async ({ expression }) => {
    try {
      console.log(`  🔢 Calculando: ${expression}`);
      const result = eval(expression);
      console.log(`     → ${result}`);
      return { result };
    } catch (error) {
      console.log(`     ✗ Error: ${error.message}`);
      return { error: error.message };
    }
  }
});

// Agente
const agente = new ToolLoopAgent({
  model,
  instructions,
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
console.log(`⚠️  Nota: La búsqueda web puede tardar 30-60 segundos... (${new Date().toLocaleTimeString()})\n`);

const startTime = Date.now();
const { text, steps } = await agente.generate({ prompt });
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

console.log("\n" + "=".repeat(70));
console.log("📊 RESULTADO:");
console.log("=".repeat(70));
console.log(text);
console.log("=".repeat(70));
console.log(`\n✅ Análisis completado en ${steps.length} pasos (${elapsed}s - ${new Date().toLocaleTimeString()})\n`);

