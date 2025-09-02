
function sumar(lista){
    let suma = 0;
    for(let x of lista){
        suma += x;
    }
    return suma;
}

let a = [1, 2, 3, 4, 5];
let b = sumar(a);

Array.prototype.sumar = function(){
    let suma = 0;
    for(let x of this){
        suma += x;
    }
    return suma;
}

Array.prototype.duplicar = function(){
    return this.map(x => x * 2);
}

let c = a.sumar();

c = a.duplicar().filter(x => x > 5).sumar()

let persona = {
    nombre: "Juan",
    apellido: "Pérez",
    edad: 30,
};

class Persona {
    #nombre = "";
    #apellido = "";
    #edad = 0

    constructor(nombre, apellido, edad) {
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#edad = edad;
    }

    get nombreCompleto() {
        return `${this.#apellido}, ${this.#nombre} `;
    }

    set nombreCompleto(value) {
        let partes = value.split(", ");
        this.#apellido = partes[0];
        this.#nombre = partes[1];
    }

    get nombre() {
        return this.#nombre;
    }

    get apellido() {
        return this.#apellido;
    }

    get edad() {
        return this.#edad;
    }

    get nombre() {
        return this.#nombre;
    }

    get apellido() {
        return this.#apellido;
    }

    get edad() {
        return this.#edad;
    }

    set edad(value) {
        if (value < 0 || value > 120) {
            console.error("Edad inválida");
            return;
        }
        this.#edad = value;
    }

    toString() {
        return `Nombre: ${this.#nombre} Apellido: ${this.#apellido} Edad: ${this.#edad}`;
    }
}


let p = new Persona("Ana", "García", 25);
p.edad = 1000
p.nombreCompleto = "López, María";
console.log(`Nombre: ${p.nombreCompleto} Edad: ${p.edad}`);


class Stack {
    #items = [];

    constructor() {
        this.#items = [];
    }

    push(item) {
        this.#items.push(item);
        return this
    }

    pop() {
        let tmp = this.#items[this.#items.length - 1];
        this.#items.length--;
        return tmp;
    }

    get isEmpty() {
        return this.#items.length === 0;
    }

    get peek() {
        return this.#items[this.#items.length - 1];
    }
}


let s = new Stack();
s.push(1).push(2).push(3);
while (!s.isEmpty) {
    console.log(s.pop());
}
let s1 = new Stack();
let s2 = new Stack();   

