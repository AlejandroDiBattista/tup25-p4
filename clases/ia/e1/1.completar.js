import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const model = openai("gpt-4o-mini")
async function generar(prompt) {
    const { text } = await generateText({ model, prompt })
    return text
}


async function definicion(palabra){
    return await generar(`Dame la definición mas breve de la palabra "${palabra}"`)
}

async function calcularFechaAbsoluta(fechaRelativa) {
    return await generar(`
        Hoy es ${new Date().toISOString().split("T")[0]}. 
        Dada la fecha relativa "${fechaRelativa}", 
        ¿cuál es la fecha absoluta correspondiente en formato YYYY-MM-DD?
        Mostrame solo la fecha.
    `)
}

async function extraerDatos(texto) {
    return await generar(`
        Extrae los datos importantes del siguiente texto y preséntalos en formato JSON:
        "${texto}"
    `)
}

async function traducir(texto, idiomaDestino) {
    return await generar(`
        Traduce el siguiente texto al ${idiomaDestino}:
        "${texto}"
    `)
}


console.log("\n== Realizar definiciones en el Diccionario ==")
console.log(await definicion("agencia"))

console.log("\n== Calcular fecha absoluta ==")
console.log(await calcularFechaAbsoluta("dentro de 3 semanas"))

console.log("\n== Extraer datos ==")
console.log(await extraerDatos("El 25 de diciembre de 2023 es Navidad, mi prima cumple 10 años y planeamos reunirnos en la casa de mis abuelos en Buenos Aires."))

console.log("\n== Traducir texto ==")
console.log(await traducir("Hola, ¿cómo estás?", "inglés"))

