let p = {
    nombre: "Juan",
    apellido: "Pérez",
    edad: 30,
    nombreCompleto(){
        return `${this.apellido}, ${this.nombre}`;
    }
}

function Persona(nombre, apellido, edad){
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
}

Persona.prototype.nombreCompleto = function(){
    return `${this.apellido}, ${this.nombre}`;
}

let a = new Persona("Ana", "García", 25);

console.log(p.nombreCompleto());

let n = [10, 20, 5]

n.map(x => x * x)
n.reduce((acc, x) => acc + x, 0);

Array.prototype.sum = function(){
    let suma = 0;
    this.forEach(x => suma += x);
    return suma;
}

console.log(n.sum())

class Contacto {
    #edad = 0

    constructor(nombre, apellido,edad){
        this.nombre = nombre;
        this.apellido = apellido
        this.#edad = edad;
    }

    get nombreCompleto(){
        return `${this.apellido}, ${this.nombre}`;
    }

    set nombreCompleto(nuevo){
        let [apellido, nombre] = nuevo.split(", ");
        this.apellido = apellido;
        this.nombre = nombre;
    }

    get edad(){
        return this.#edad;
    }

    set edad(e){
        if(e > 0 && e < 120){
            this.#edad = e;
        }
    }
}
let  b= new Contacto("Luis", "Pérez", "123456789");
b.edad = -100;
// b.setEdad(-100);
b.nombreCompleto = "Gómez, Luis";

console.log(b.nombre, b.apellido, b.edad);