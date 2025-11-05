import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import { writeFile, readFile } from "node:fs/promises"
import { marked } from "marked"
import TerminalRenderer from "marked-terminal"

marked.setOptions({
    renderer: new TerminalRenderer()
})

export async function leer(mensaje) {
    const rl = readline.createInterface({ input, output })
    const respuesta = await rl.question(mensaje)
    rl.close()
    return respuesta.trim()
}

export async function escribir(texto, archivo="output.md") {
    await writeFile(archivo, texto, "utf-8")
    console.log(`✅ Archivo guardado: ${archivo}`)
}

export async function mostrar(markdownText) {
    console.log(marked(markdownText))
    escribir(markdownText)
}

export async function mostrarMD(archivo="output.md") {
    try {
        const contenido = await readFile(archivo, "utf-8")
        console.log(marked(contenido))
    } catch (error) {
        console.error(`❌ Error al leer el archivo ${archivo}:`, error.message)
    }
}