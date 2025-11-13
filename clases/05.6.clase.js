class Persona {
    #nombre
    #apellido
    #edad = 18
    constructor(nombre, apellido, edad) {
        this.#nombre   = nombre
        this.#apellido = apellido
        this.#edad     = edad
    }

    get nombreCompleto() {
        return `${this.#apellido}, ${this.#nombre}`
    }
    set nombreCompleto(valor) {
        [this.#apellido, this.#nombre] = valor.split(", ")
    }

    get edad() {
        return this.#edad
    }

    set edad(valor) {
        if (valor >= 0 && valor <= 120) {
            this.#edad = valor
        }
    }

    toString() {
        return `${this.nombreCompleto} (${this.edad})`
    }

    toJSON() {
        return {
            nombre: this.#nombre,
            apellido: this.#apellido,
            edad: this.#edad
        }
    }

    static fromJSON(json) {
        const data = JSON.parse(json)
        return new Persona(data.nombre, data.apellido, data.edad)
    }
}

class Empleado extends Persona {
    #puesto
    #sueldo

    constructor(nombre, apellido, edad, puesto, sueldo) {
        super(nombre, apellido, edad)
        this.#puesto = puesto
        this.#sueldo = sueldo
    }

    get puesto() {
        return this.#puesto
    }
    
    set puesto(valor) {
        this.#puesto = valor
    }

    get sueldo() {
        return this.#sueldo
    }

    set sueldo(valor) {
        if (valor > 0) {
            this.#sueldo = valor
        }
    }

    toString() {
        return `${this.nombreCompleto} (${this.edad}) - ${this.puesto}: $${this.sueldo}`
    }

    toJSON() {
        const base = super.toJSON()
        base.puesto = this.#puesto
        base.sueldo = this.#sueldo
        return base
    }

    static fromJSON(json) {
        const data = JSON.parse(json)
        return new Empleado(data.nombre, data.apellido, data.edad, data.puesto, data.sueldo)
    }
}

console.log("Clase Persona")
let p = new Persona("Juan", "Pérez", 30)
console.log(p.nombreCompleto + " " + p.edad)
console.log(JSON.stringify(p))

console.log("Clase Empleado")
let e = new Empleado("Ana", "García", 28, "Desarrolladora", 50000)
console.log(e.nombreCompleto + " " + e.edad + " " + e.puesto + " " + e.sueldo)
console.log(JSON.stringify(e))

class Agenda {
    #contactos = []
    agregarContacto(contacto) {
        this.#contactos.push(contacto)
    }
    
    eliminarContacto(contacto) {
        this.#contactos = this.#contactos.filter(c => c !== contacto)
    }

    listarContactos() {
        return this.#contactos
    }

    toJSON() {
        return this.#contactos.map(c => c.toJSON())
    }
    
    static fromJSON(json) {
        const data = JSON.parse(json)
        const agenda = new Agenda()
        data.forEach(c => {
            if (c.puesto && c.sueldo) {
                agenda.agregarContacto(Empleado.fromJSON(JSON.stringify(c)))
            } else {
                agenda.agregarContacto(Persona.fromJSON(JSON.stringify(c)))
            }
        })
        return agenda
    }
}

let agenda = new Agenda()
agenda.agregarContacto(p)
agenda.agregarContacto(e)
console.log(agenda.listarContactos().map(c => c.toString()))
let json = JSON.stringify(agenda.listarContactos(), null, 2)
console.log(json)


// DOM

let tab = (nivel) => "  ".repeat(nivel)

class Nodo {
    render(nivel=0) {
        return `${tab(nivel)}<${this.constructor.name}>\n` + 
               `${tab(nivel)}</${this.constructor.name}>\n`
    }
}

class Texto extends Nodo {
    constructor(valor) {
        super()
        this.valor = valor
    }
    toString() {
        return this.valor
    }
    render(nivel=0){
        return `${tab(nivel)}${this.valor}\n`
    }
}

class Etiqueta extends Nodo {
    #tag
    #atributos
    #hijos
    constructor(tag, ...args) {
        super()
        this.#tag = tag
        let atributos = {}
        let hijos = []
        if (args.length > 0 && typeof args[0] === "object" && !Array.isArray(args[0]) && !(args[0] instanceof Nodo)) {
            atributos = args[0]
            hijos = args.slice(1)
        } else {
            hijos = args
        }
        this.#tag = tag
        this.#atributos = atributos
        this.#hijos = []
        hijos.forEach(h => this.add(h))
    }

    add(hijo){
        if(typeof hijo == "string"){
            this.#hijos.push(new Texto(hijo))
        } else {
            this.#hijos.push(hijo)
        }
    }

    toString() {
        const attrs = Object.entries(this.#atributos)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")
        return `<${this.#tag}${attrs ? " " + attrs : ""}>${this.#hijos.map(h => h.toString()).join("")}</${this.#tag}>`
    }

    render(nivel=0){
        let atributos = Object.entries(this.#atributos)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")
        if (this.#hijos.length === 0) {
            return `${tab(nivel)}<${this.#tag}${atributos ? " " + atributos : ""} />\n`
        }
        return (
            `${tab(nivel)}<${this.#tag}${atributos ? " " + atributos : ""}>\n` + 
                this.#hijos.map(h => h.render(nivel + 1)).join("") + 
            `${tab(nivel)}</${this.#tag}>\n`
        )
    }
}

const etiquetas = ["html", "head", "body", "div", "ul", "li", "a", "title"]
for (const tag of etiquetas) {
    globalThis[tag] = (...args) => new Etiqueta(tag, ...args)
}
let texto = (valor) => new Texto(valor)

let r = html(
    head(
        title("Document")
    ),
    body(
        div({ color: "red" },
            "Listado de buscadores",
            ul(
                li( a({ href: "www.google.com" }, "Google")),
                li( a({ href: "www.bing.com" }, "Bing"))
            )
        )
    )
)

console.log(r.render())