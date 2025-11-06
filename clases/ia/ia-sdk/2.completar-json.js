import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { titulo } from "./utils.js"

const model = openai("gpt-4o-mini");
// Definimos el esquema de salida con Zod
const esquemaOpinion = z.object({
  sentimiento: z.enum(["positivo", "neutral", "negativo"]),
  emociones: z.array(
      z.object({
          emocion: z.string(),
          intensidad: z.number().min(0).max(10),
        })
    ),
    explicacion: z.string().descri,
});

// generateObject usa el esquema para estructurar la respuesta 

const { object } = await generateObject({
  model,
  schema: esquemaOpinion,
  prompt: `
    Analiza este comentario:
    "{La licuadora se ve linda pero no funciona, no se para que venden esta porqueria.}"
    
    Identifica las emociones presentes y su intensidad (0-10).
  `,
});


titulo("Análisis de opinión");
console.log(object);
