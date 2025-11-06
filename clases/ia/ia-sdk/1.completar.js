import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { titulo } from "./utils.js"

const model = openai("gpt-4.1")

async function generar(prompt) {
    const { text } = await generateText({ 
        model,
        prompt 
    })
    return text
}


async function definicion(palabra){
    return await generar(`Dame la 3 definiciones de: "${palabra}"`)
}

async function calcularFechaAbsoluta(fechaRelativa) {
    return await generar(`
        Hoy es ${new Date().toISOString().split("T")[0]}. 
        Dada la fecha relativa "${fechaRelativa}", 
        ¿Cuál es la fecha absoluta correspondiente en formato YYYY-MM-DD?
        Mostrame solo la fecha.
    `)
}

async function extraerTarea(texto) {
    return await generar(`
        Extrae la tarea principal del siguiente texto devolverla como un JSON:
        {
            "tarea": "...",
            "fecha": "..."
            "responsable": "..."
        }
        Si no hay alguno de los campos, pon null.

        <texto>
            ${texto}
        </texto>

        Retornar solo el JSON solicitado, sin ningun otro texto.
    `)
}

async function traducir(texto, idiomaDestino) {
    return await generar(`
        Traduce el siguiente texto al ${idiomaDestino}:
        <texto>${texto}</texto>

        Devolver solo el texto traducido, sin ningun otro texto.
    `)
}



// titulo("Realizar definiciones en el Diccionario")
// console.log(await definicion("agencia"))

// titulo("Calcular fecha absoluta")
// console.log(await calcularFechaAbsoluta("el proximo dia del ingeniero en argentina"))

titulo("Extraer tarea")
console.log(await extraerTarea("El lunes próximo, María debe enviar el informe mensual."))

// titulo("Traducir texto (al inglés)")
// console.log(await traducir("Hola, ¿cómo estás?", "inglés"))

// titulo("Traducir texto (al coreano)")
// console.log(await traducir("Hola, ¿cómo estás?", "coreano"))

// titulo("Traducir texto (al español)")
// console.log(await traducir("안녕하세요, 어떻게 지내세요?", "español"))
