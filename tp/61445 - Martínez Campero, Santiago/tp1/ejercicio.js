import {prompt, read, write} from './io.js';

class Contacto {
    #id
    #nombre
    #apellido
    #edad
    #telefono
    #email
    constructor({ id, nombre, apellido, edad, telefono, email }) {
        this.#id = id;
        this.#nombre = nombre ?? '';
        this.#apellido = apellido ?? '';
        this.#edad = edad ?? '';
        this.#telefono = telefono ?? '';
        this.#email = email ?? '';
    }
    get id(){ return this.#id }
    get nombre(){ return this.#nombre }
    get apellido(){ return this.#apellido }
    get edad(){ return this.#edad }
    get telefono(){ return this.#telefono }
    get email(){ return this.#email }
    get nombreCompleto(){
        const apellido = (this.#apellido || '').trim()
        const nombre = (this.#nombre || '').trim()
        if (apellido && nombre) {
            return apellido + ", " + nombre
        } else if (apellido) {
            return apellido
        } else if (nombre) {
            return nombre
        } else {
            return ''
        }
    }
    toJSON(){
        const obj = {}
        obj.id = this.#id
        obj.nombre = this.#nombre
        obj.apellido = this.#apellido
        obj.edad = this.#edad
        obj.telefono = this.#telefono
        obj.email = this.#email
        return obj
    }
    static from(obj){
        return new Contacto({
            id: obj.id,
            nombre: obj.nombre,
            apellido: obj.apellido,
            edad: obj.edad,
            telefono: obj.telefono,
            email: obj.email,
        })
    }
}

class Agenda {
    #contactos = []
    #proximoId = 1

    constructor(contactos = []){
        this.#contactos = []
        for (const item of contactos) {
            const c = Contacto.from(item)
            this.#contactos.push(c)
        }
        let maximoId = 0
        for (const c of this.#contactos) {
            if (typeof c.id === 'number' && c.id > maximoId) {
                maximoId = c.id
            }
        }
        this.#proximoId = maximoId + 1
    }

    static fromJson(json){
        if(!Array.isArray(json)) return new Agenda([])
        return new Agenda(json)
    }

    toJson(){ return this.#contactos.map(c=>c.toJSON()) }

    agregar({nombre, apellido='', edad=null, telefono='', email=''}){
        const contacto = new Contacto({ id: this.#proximoId++, nombre, apellido, edad, telefono, email })
        this.#contactos.push(contacto)
        return contacto
    }

    listarOrdenado(){
        return [...this.#contactos].sort((a,b)=>a.nombreCompleto.localeCompare(b.nombreCompleto, 'es'))
    }

    buscar(texto){
        const q = (texto || '').toLowerCase()
        const resultados = []
        for (const c of this.#contactos) {
            const nombre = (c.nombre || '').toLowerCase()
            const apellido = (c.apellido || '').toLowerCase()
            const edadStr = String(c.edad == null ? '' : c.edad).toLowerCase()
            const telefono = (c.telefono || '').toLowerCase()
            const email = (c.email || '').toLowerCase()
            if (
                nombre.includes(q) ||
                apellido.includes(q) ||
                edadStr.includes(q) ||
                telefono.includes(q) ||
                email.includes(q)
            ) {
                resultados.push(c)
            }
        }
        return resultados
    }

    obtenerPorId(id){
        const buscado = +id
        for (let i = 0; i < this.#contactos.length; i++) {
            const c = this.#contactos[i]
            if (c.id === buscado) {
                return c
            }
        }
        return null
    }

    borrarPorId(id){
        const buscado = +id
        for (let i = 0; i < this.#contactos.length; i++) {
            const c = this.#contactos[i]
            if (c.id === buscado) {
                const eliminado = c
                this.#contactos.splice(i, 1)
                return eliminado
            }
        }
        return null
    }

    editar(id, campos){
        const c = this.obtenerPorId(id)
        if(!c) return null
        const actualizado = new Contacto({
            id: c.id,
            nombre: campos.nombre ?? c.nombre,
            apellido: campos.apellido ?? c.apellido,
            edad: (campos.edad !== undefined) ? (Number.isFinite(+campos.edad) ? +campos.edad : c.edad) : c.edad,
            telefono: campos.telefono ?? c.telefono,
            email: campos.email ?? c.email,
        })
        const i = this.#contactos.findIndex(x=>x.id===c.id)
        this.#contactos[i] = actualizado
        return actualizado
    }
}

function imprimirTabla(contactos){
    const header = 'ID Nombre completo               Edad  Teléfono       Email'
    console.log(header)
    for(const c of contactos){
        const id = String(c.id).padStart(2,'0')
        const nom = c.nombreCompleto.padEnd(28,' ')
        const edad = String(c.edad ?? '-').padStart(4,' ')
        const tel = String(c.telefono ?? '').padEnd(13,' ')
        const mail = String(c.email ?? '')
        console.log(`${id} ${nom} ${edad}  ${tel} ${mail}`)
    }
}

async function pausar(){ await prompt("\nPresione Enter para continuar... ") }

async function menu(agenda){
    while(true){
        console.log("\n=== AGENDA DE CONTACTOS ===")
        console.log("1. Listar")
        console.log("0. Salir")
        const op = await prompt("\nIngresar opción :> ")
        console.log("\n-----\n")
        if(op === '0'){
            return
        }
        if(op === '1'){
            console.log("== Lista de contactos ==")
            const lista = agenda.listarOrdenado()
            imprimirTabla(lista)
            await pausar()
        } else {
            console.log("Opción no válida")
        }
    }
}

// Programa principal
const datos = await read('./agenda.json')
const agenda = Agenda.fromJson(datos)
await menu(agenda)
