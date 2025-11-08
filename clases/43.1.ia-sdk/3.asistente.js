import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { leer, titulo } from "./utils.js";

const model = openai("gpt-5-mini");

console.log("🤖 Asistente de IA - Escribe 'salir' para terminar\n");

// Historial de conversación con instrucción del sistema
const mensajes = [
  {
    role: "system",
    content: "Eres un asistente útil, cortés y conciso. Responde de manera clara y breve."
  }
];

titulo("Asistente de IA - Chat interactivo")
while (true) {
  // Leer entrada del usuario
  const entrada = await leer("🙎: ");
  
  if (entrada.toLowerCase() === "salir") {
    console.log("\n👋 ¡Hasta luego!");
    break;
  }
  
  // Agregar mensaje del usuario al historial
  mensajes.push({ 
    role: "user", 
    content: entrada 
  });
  
  // Generar respuesta
  const { text } = await generateText({ 
    model, 
    messages: mensajes 
  });
  
  // Agregar respuesta del asistente al historial
  mensajes.push({ 
    role: "assistant", 
    content: text 
  });
  console.log(`\n🤖: ${text}\n`);
}

