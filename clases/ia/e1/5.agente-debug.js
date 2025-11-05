import { ToolLoopAgent, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

console.log("🔧 Iniciando debug del agente...\n");

// Herramienta calculadora
const calculadora = tool({
  description: "Evalúa expresiones matemáticas",
  inputSchema: z.object({
    expression: z.string().describe("Expresión aritmética")
  }),
  execute: async ({ expression }) => {
    console.log(`  🔢 Ejecutando calculadora: ${expression}`);
    try {
      const result = eval(expression);
      console.log(`  ✓ Resultado: ${result}`);
      return { result };
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
      return { error: error.message };
    }
  }
});

console.log("✓ Herramientas definidas");

// Agente
try {
  console.log("✓ Creando agente...");
  const agente = new ToolLoopAgent({
    model: openai("gpt-5-mini"),
    instructions: "Calcula operaciones matemáticas simples usando la calculadora.",
    tools: { 
      calculadora
    },
    maxSteps: 3
  });
  console.log("✓ Agente creado\n");

  // Ejecución
  const prompt = "¿Cuánto es 5 + 3?";
  console.log(`📝 Pregunta: ${prompt}`);
  console.log("⏳ Generando respuesta...\n");

  const startTime = Date.now();
  const { text, steps } = await agente.generate({ 
    prompt,
    onStepStart: ({ stepNumber, toolCalls }) => {
      console.log(`\n⏳ Paso ${stepNumber} iniciando...`);
      if (toolCalls && toolCalls.length > 0) {
        console.log(`   Herramienta: ${toolCalls[0].toolName}`);
      }
    },
    onStepFinish: ({ stepNumber }) => {
      console.log(`✓ Paso ${stepNumber} completado`);
    }
  });
  const endTime = Date.now();

  console.log("\n" + "=".repeat(70));
  console.log("📊 RESULTADO:");
  console.log("=".repeat(70));
  console.log(text);
  console.log("=".repeat(70));
  console.log(`\n✅ Completado en ${steps.length} pasos (${endTime - startTime}ms)\n`);

} catch (error) {
  console.error("\n❌ ERROR:", error.message);
  console.error("\nStack trace:", error.stack);
  process.exit(1);
}
