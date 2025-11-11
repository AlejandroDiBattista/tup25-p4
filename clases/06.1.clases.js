// POO - Programación Orientada a Objetos

// Es javascript debemos distinguir entre:
// - Objetos: instancias de clases
// - Clases: plantillas para crear objetos

// A diferencia de otros lenguajes podemos tener objetos sin clases
// en realidad no soporta POO sino que trabajan con una idea similar... prototype.


// Definimos un objeto literal
let persona = {
    nombre: "Juan",
    edad: 30,

    saludar: function() { // Este es un método, accede al 'estado' del objeto -> this.nombre o this.edad
        console.log(`Hola, me llamo ${this.nombre} y tengo ${this.edad} años.`);
    }
}

// Sintaxis alternativa para definir métodos en objetos literales
persona = {
    nombre: "Ana",
    edad: 25,

    saludar() { // Sintaxis corta para definir métodos
        console.log(`Hola, me llamo ${this.nombre} y tengo ${this.edad} años.`);
    }
}

// Funcion constructora
// Las funciones constructoras se definen con mayúscula inicial por convención
// Se llaman con 'new' para crear un nuevo objeto
// Dentro de la función constructora, 'this' se refiere al nuevo objeto que se está creando

function Persona(nombre, edad) { // Función constructora
    this.nombre = nombre;
    this.edad = edad;

    this.saludar = function() {
        console.log(`Hola, me llamo ${this.nombre} y tengo ${this.edad} años.`);
    }
}

// Crear un objeto a partir de la función constructora
let persona1 = new Persona("Carlos", 28);
let persona2 = new Persona("María", 22);

console.log(persona1);
console.log(persona2);

persona.saludar();
persona1.saludar();
persona2.saludar();

// Puedo agregar metodos compartidos mediante el prototipo
// Todos los objetos creados con la función constructora compartirán este método

Persona.prototype.despedir = function() { // Agregamos un método al prototipo de Persona
    console.log(`Adiós, me llamo ${this.nombre}.`);
}

persona1.despedir();
persona2.despedir();

// Esto lo podemos hacer incluso con clases existentes.

// Esta seria una función normal que cuenta los elementos de una lista
function count(lista){
    let contador = 0;
    for (let item of lista){
        if(item){
            contador++;
        }
    }
    return contador;
}

// Agregamos el método count al prototipo de Array
// Ahora todos los arrays tendrán este método disponible
Array.prototype.count = function(){
    let lista = this; // 'this' se refiere al array sobre el que se llamó el método
    let contador = 0;
    for (let item of lista){
        if(item){
            contador++;
        }
    }
    return contador;
}   

let numeros = [1,2,3,4,5];
console.log(count(numeros)); // Usando la función count
console.log(numeros.count()); // Usando el método count agregado al prototipo de Array


/// CLASES 
// Sintaxis de clases (azúcar sintáctico sobre las funciones constructoras y prototipos)

// Una pila es una estructura de datos LIFO (Last In, First Out)
//  El último elemento en entrar es el primero en salir
//  Ejemplo: una pila de platos
//  Operaciones básicas: push (apilar), pop (desapilar), peek (ver el tope), isEmpty (ver si está vacía)

class Stack { // Clase base (abstracta)
    push(elemento) {}
    pop() {}
    peek() {}
    get isEmpty() {}
    get size() {}
    *[Symbol.iterator]() {} // Iterador para recorrer la pila
}

// Implementación de Stack usando arrays
class StackConArrays extends Stack {
    #elementos;

    constructor() {
        this.#elementos = [];
    }

    push(elemento) {
        this.#elementos.push(elemento);
        return this; // Permite encadenar llamadas
    }

    pop() {
        return this.#elementos.pop();
    }

    peek() {
        return this.#elementos[this.#elementos.length - 1];
    }

    get isEmpty() {
        return this.#elementos.length === 0;
    }

    get size() {
        return this.#elementos.length;
    }

    *[Symbol.iterator]() {
        for (let i = this.#elementos.length - 1; i >= 0; i--) {
            yield this.#elementos[i];
        }
    }
}


class StackConListasEncadenadas extends Stack {
    #top;
    #size;

    constructor() {
        this.#top = null;
        this.#size = 0;
    }

    push(elemento) {
        const newNode = { value: elemento, next: this.#top };
        this.#top = newNode;
        this.#size++;
        return this; // Permite encadenar llamadas
    }

    pop() {
        if (this.isEmpty) {
            return null; // O lanzar una excepción
        }
        const poppedValue = this.#top.value;
        this.#top = this.#top.next;
        this.#size--;
        return poppedValue;
    }

    peek() {
        return this.isEmpty ? null : this.#top.value;
    }

    get isEmpty() {
        return this.#size === 0;
    }

    get size() {
        return this.#size;
    }
    
    *[Symbol.iterator]() {
        let current = this.#top;
        while (current) {
            yield current.value;
            current = current.next;
        }
    }
}

// Usando la clase Stack
let s = new Stack();
s.push(1)
 .push(2)
 .push(3);

while(!s.isEmpty){
    console.log(s.pop());
}

s = new Stack();
s.push(100).push(200).push(300);

let r = new Stack();

while(!s.isEmpty){
    r.push(s.pop());
}

// Herencia
// Permite crear una clase basada en otra clase
// La clase hija hereda propiedades y métodos de la clase padre
// Puede agregar nuevos métodos o sobrescribir los existentes


class Animal { 
    constructor(nombre) { // Método especial para inicializar el objeto
        this.nombre  = nombre;
    }

    hacerSonido() { // Método de la clase
        console.log(`Me llamo ${this.nombre} y hago un sonido.`);
    }
}

// Crear instancias de la clase Animal
let perro = new Animal("Firulais");
let gato  = new Animal("Michi");

perro.hacerSonido();
gato.hacerSonido();

// Herencia
class Perro extends Animal { // Perro hereda de Animal
    constructor(nombre, raza) {
        super(nombre); // Llamamos al constructor de la clase padre
        this.raza = raza;
    }

    hacerSonido() { // Sobrescribimos el método hacerSonido
        console.log(`Me llamo ${this.nombre}. Soy un ${this.raza} y hago GUUAU.`);
    }
}

class Gato extends Animal { // Gato hereda de Animal
    constructor(nombre, color) {
        super(nombre); // Llamamos al constructor de la clase padre
        this.color = color;
    }

    hacerSonido() { // Sobrescribimos el método hacerSonido
        console.log(`Me llamo ${this.nombre}. Soy de color ${this.color} y hago MIAU.`);
    }
}

let miPerro = new Perro("Rex", "Labrador");
miPerro.hacerSonido(); // Rex ladra.
console.log(miPerro);

let miGato = new Gato("Whiskers", "gris");
miGato.hacerSonido(); // Whiskers maulla.
console.log(miGato);


// Una jerarquía de clases más compleja

// Persona -> Empleado -> Gerente (con empleados a cargo)
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad   = edad;
    }

    saludar() {
        console.log(`Hola, me llamo ${this.nombre} y tengo ${this.edad} años.`);
    }

    get esMayorDeEdad() {
        return this.edad >= 18;
    }
}

class Empleado extends Persona {
    constructor(nombre, edad, puesto, sueldo) {
        super(nombre, edad);
        this.puesto = puesto;
        this.sueldo = sueldo;
    }

    aumentar(porcentaje) {
        if(porcentaje < 0){
            console.log("El porcentaje debe ser positivo.");
            return;
        }
        this.sueldo += this.sueldo * (porcentaje / 100);
        console.log(`El nuevo sueldo de ${this.nombre} es ${this.sueldo}.`);
    }

    get aguinaldo() {
        return this.sueldo;
    }

    get sueldoAnual() {
        return this.sueldo * 12 + this.aguinaldo();
    }

    trabajar() {
        console.log(`${this.nombre} está trabajando como ${this.puesto}.`);
    }
}

class Gerente extends Empleado {
    constructor(nombre, edad, puesto, departamento) {
        super(nombre, edad, puesto);
        this.departamento = departamento;
        this.empleados = [];
    }

    agregar(empleado) {
        if (empleado instanceof Empleado) {
            this.empleados.push(empleado);
            console.log(`${empleado.nombre} ha sido agregado al equipo de ${this.nombre}.`);
        } else {
            console.log("Solo se pueden agregar empleados.");
        }
        return this
    }

    get bono() {
        let bonoTotal = 0;
        for (let emp of this.empleados) {
            bonoTotal += emp.sueldo * 0.1; // 10% del sueldo de cada empleado
        }
        console.log(`El bono total para el departamento de ${this.departamento} es ${bonoTotal}.`);
        return bonoTotal;
    }

    get sueldoAnual() {
        return super.sueldoAnual + this.bono;
    }

    dirigir() {
        console.log(`${this.nombre} está dirigiendo el departamento de ${this.departamento}.`);
    }
}

console.log(`¿Es mayor de edad? ${laura.esMayorDeEdad ? 'Sí' : 'No'}`);

let laura = new Empleado("Laura", 30, "Desarrolladora", 5000);
let pedro = new Empleado("Pedro", 45, "Diseñador", 4500);

laura.aumentar(10);
console.log(`Sueldo anual de ${laura.nombre}: ${laura.sueldoAnual()}`);

let ana = new Gerente("Ana", 40, "Gerente de TI", "Tecnología");
ana
    .agregar(laura)
    .agregar(pedro);

console.log(`Sueldo anual de ${ana.nombre}: ${ana.sueldoAnual}`);



