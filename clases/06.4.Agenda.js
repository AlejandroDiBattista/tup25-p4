class Agenda {
    #contactos
    constructor() {
        this.#contactos = [];
    }
    agregar(contacto) {
        this.#contactos.push(contacto);
        return this;
    }
    listar() {
        return this.#contactos;
    }
}

class Contacto {
    #nombre
    #apellido
    #telefono
    constructor(nombre, apellido, telefono) {
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#telefono = telefono;
    }
    
    get nombreCompleto() {
        return `${this.#nombre} ${this.#apellido}`;
    }

    get telefono() {
        return this.#telefono;
    }
}

function* listaContactos(agenda) {
    for (let contacto of agenda.listar()) {
        yield contacto;
    }
}


// Ejemplo de uso
const agenda = new Agenda();
agenda
    .agregar(new Contacto("Ana", "García", "123-456-789"))
    .agregar(new Contacto("Luis", "Martínez", "987-654-321"));

for (let contacto of agenda.listar()) {
    console.log(`Nombre: ${contacto.nombreCompleto}, Teléfono: ${contacto.telefono}`);
}

for(let x of listaContactos(agenda)) {
    console.log(`Nombre: ${x.nombreCompleto}, Teléfono: ${x.telefono}`);
}

function *pares(){
    yield 2;
    console.log(">",2);
    yield 4;
    console.log(">",4);
    yield 6;
    console.log(">",6);
    yield 8;
    yield 10;
}

for(let x of pares()){
    console.log(">Antes")
    console.log(x);
}