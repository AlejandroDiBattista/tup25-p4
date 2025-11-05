import { ToolLoopAgent, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

console.log("🧪 Testing ToolLoopAgent callbacks...\n");

const calculadora = tool({
  description: "Evalúa expresiones matemáticas",
  inputSchema: z.object({
    expression: z.string().describe("Expresión aritmética")
  }),
  execute: async ({ expression }) => {
    console.log(`  [TOOL] Ejecutando: ${expression}`);
    return { result: eval(expression) };
  }
});

const agente = new ToolLoopAgent({
  model: openai("gpt-5-mini"),
  instructions: "Usa la calculadora para resolver operaciones matemáticas.",
  tools: { calculadora },
  maxSteps: 3
});

console.log("Testing different callback options...\n");

try {
  const result = await agente.generate({ 
    prompt: "¿Cuánto es 10 + 5?",
    
    // Probando diferentes nombres de callbacks
    onStepStart: (data) => {
      console.log("[onStepStart] Called:", JSON.stringify(data, null, 2));
    },
    onStepFinish: (data) => {
      console.log("[onStepFinish] Called:", JSON.stringify(data, null, 2));
    },
    onStep: (data) => {
      console.log("[onStep] Called:", JSON.stringify(data, null, 2));
    },
    experimental_onStepStart: (data) => {
      console.log("[experimental_onStepStart] Called:", JSON.stringify(data, null, 2));
    },
    experimental_onStepFinish: (data) => {
      console.log("[experimental_onStepFinish] Called:", JSON.stringify(data, null, 2));
    }
  });
  
  console.log("\n✅ Result:", result.text);
  console.log("✅ Steps:", result.steps.length);
  
} catch (error) {
  console.error("❌ Error:", error.message);
}
