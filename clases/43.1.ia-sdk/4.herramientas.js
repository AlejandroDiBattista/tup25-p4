import { generateText, tool, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { titulo } from "./utils.js";

// Configurar el modelo con opciones predeterminadas
// Esto permite definir providerOptions una sola vez en lugar de en cada llamada
const model = openai("gpt-5-mini");

const calculadora = tool({
  description: "Evalúa una expresión aritmética",
  inputSchema: z.object({
    expression: z.string().describe("Expresión aritmética a evaluar")
  }),
  execute: async ({ expression }) => {
    console.log(`🔢 Calculando: ${expression}`);
    return { result: eval(expression) };
  }
});

// const buscadorWeb = tool({
//   description: "Busca información en la web",
//   inputSchema: z.object({
//     query: z.string().describe("Término de búsqueda")
//   }),
//   execute: async ({ query }) => {
//     console.log(`🌐 Buscando en la web: ${query}`);
//   }
// });

const { text, sources } = await generateText({
  model,
  tools: { 
    calculadora,
    web_search: openai.tools.webSearch({})
  },
  system: `
    Eres un asistente útil que puede hacer cálculos y buscar información en internet. 
    Cuando tenga que cotizar el dolar usa la ultima cotizacion disponible del dolar oficial segun el BCRA.
    Se muy breve en la respuestas, has tus mejores estimaciones y no de explicaciones adicionales
    No pongas fuentes en la respuesta final
  `,
  prompt: "¿Cuánto es monto total en pesos de un crédito en 12 cuotas de 48 dolares? ",
  stopWhen: stepCountIs(10)
});

titulo("Una respuesta del agente con herramientas");
console.log(text);

if (sources && sources.length > 0) {
  console.log("\n🔗 Fuentes:");
  sources.forEach((source, i) => {
    console.log(`  ${i + 1}. ${source.url}`);
  });
}

// // Mostrar información de uso incluyendo tokens de razonamiento
// console.log("\n📊 Uso de tokens:");
// console.log(`  Total: ${usage.totalTokens}`);
// console.log(`  Entrada: ${usage.inputTokens}`);
// console.log(`  Salida: ${usage.outputTokens}`);
// if (providerMetadata?.openai?.reasoningTokens) {
//   console.log(`  Razonamiento: ${providerMetadata.openai.reasoningTokens}`);
// }
