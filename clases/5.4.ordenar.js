// Bubble Sort: recorrer la lista varias veces, intercambiando elementos adyacentes
function bubbleSort(lista) {
    let ordenado = false;
    while (!ordenado) {                     // Repetir mientras no esté ordenado
        ordenado = true;                    // Asumir que la lista está ordenada
        for(let i = 0; i < lista.length - 1; i++) {
            if(lista[i] > lista[i + 1]) {
                [lista[i], lista[i + 1]] = [lista[i + 1], lista[i]];
                ordenado = false;           // Si hubo un intercambio, la lista no estaba ordenada
            }
        }
    } 
    return lista;
}

// Insertion Sort: insertar cada elemento en su lugar
function insertSort(lista){ 
    for(let i = 1; i < lista.length; i++) {
        let clave = lista[i], j = i - 1;
        while(j >= 0 && lista[j] > clave) { // Va desplazando los elementos mayores a la derecha
            lista[j + 1] = lista[j];
            j--;
        }
        lista[j + 1] = clave;
    }
    return lista;
}

// Selection Sort: buscar el menor y ponerlo en la posición correcta
function selectionSort(lista) {
    for(let i = 0; i < lista.length - 1; i++) {
        let minIndex = i;
        for(let j = i + 1; j < lista.length; j++) {
            if(lista[j] < lista[minIndex]) { // Busca el índice del menor
                minIndex = j;
            }
        }
        if(minIndex !== i) { // Intercambia solo si es necesario
            [lista[i], lista[minIndex]] = [lista[minIndex], lista[i]];
        }
    }
    return lista;
}

// Usando el método sort de los arrays
// Por defecto ordena como strings
// a.sort() 

// Para ordenar números hay que pasarle una función de comparación

// let compararNumeros = (a, b) => a - b;

// let o = a.sort(compararNumeros)
// mostrar(o, console.log)

// let nombres = ["Juan", "Ana", "Pedro", "María"];
// let compararNombres = (a, b) => a.localeCompare(b);
// mostrar(nombres.sort(compararNombres), console.log);

// let personas = [
//     { nombre: "Juan",  edad: 30 },
//     { nombre: "Ana",   edad: 25 },
//     { nombre: "Pedro", edad: 35 },
//     { nombre: "María", edad: 28 }
// ];


// let compararEdad = (a, b) => a.edad - b.edad;
// let compararPorNombre = (a, b) => a.nombre.localeCompare(b.nombre);
// mostrar(personas.sort(compararEdad), console.log);
// mostrar(personas.sort(compararPorNombre), console.log);


// function buscar(lista, valor){
//     for(let x of lista) {
//         if(x === valor) {
//             return x;
//         }
//     }
//     return undefined;
// }

// function buscarBinario(lista, valor, min=0, max = lista.length-1) {
//     if (min > max) 
//         return false;
//     let medio = Math.floor((min + max) / 2);
//     if (lista[medio] === valor) 
//         return true
//     if (lista[medio] < valor)   
//         return buscarBinario(lista, valor, medio + 1, max)
//     else
//         return buscarBinario(lista, valor, min, medio - 1)
// }

// function buscarBinarioNoRecursivo(lista, valor){
//     let min = 0;
//     let max = lista.length - 1;
//     while (min <= max) {
//         let medio = Math.floor((min + max) / 2);
//         if (lista[medio] === valor) return true;
//         if (lista[medio] < valor) min = medio + 1;
//         else max = medio - 1;
//     }
//     return false;
// }

// // Ordenar con QuickSort
// //   Divido la lista en dos sublistas: menores y mayores
// //   Ordeno cada sublista
// //   Las uno nuevamente

// function quickSort(lista){
//     if(lista.length <= 1) return lista  // Condición de parada

//     let pivote = lista[0]  // Busco un pivote (un valor para dividir la lista)
//     let menores = lista.filter(x => x < pivote)  // Menores que el pivote
//     let mayores = lista.filter(x => x > pivote)  // Mayores que el pivote
//     return [...quickSort(menores), pivote, ...quickSort(mayores)]  // Ordeno cada parte y las uno nuevamente
// }

// // Una implementación estándar de búsqueda binaria
// // Retorna la posición si lo encontró.
// // Si no lo encuentra retorna un valor negativo (si lo invertimos (~) me dice la posición en donde debería estar)
// function buscarBinariaIndice(lista, valor, cmp){
//     let min = 0;
//     let max = lista.length - 1;
//     while (min <= max) {
//         let medio = Math.floor((min + max) / 2);
//         if (cmp(lista[medio], valor) === 0) return medio;
//         if (cmp(lista[medio], valor) < 0)   min = medio + 1;
//         else max = medio - 1;
//     }
//     return ~min;
// }


// let persona = {
//     nombre: "Juan",
//     apellido: "Pérez",
//     edad: 30,
// }

// function nombreCompleto(persona) {
//     return `${persona.nombre} ${persona.apellido}`;
// }

// console.log(nombreCompleto(persona));

// persona = {
//     nombre: "Juan",
//     apellido: "Pérez",
//     edad: 30,
//     nombreCompleto: function() { // Guardo la funcion dentro del objeto 
//         return `${persona.nombre} ${persona.apellido}`;
//     }
// }

// console.log(persona.nombreCompleto());

// persona = {
//     nombre: "Juan",
//     apellido: "Pérez",
//     edad: 30,
//     nombreCompleto: function() {
//         return `${this.nombre} ${this.apellido}`; // this reemplaza a `persona` y se refiere al objeto actual
//     }
// }

// persona = {
//     nombre: "Juan",
//     apellido: "Pérez",
//     edad: 30,
// }

// persona.nombreCompleto = function() {
//     return `${this.nombre} ${this.apellido}`;
// }

// console.log(persona.nombreCompleto());  

// Si queremos agregar un método a todos los objetos creados con un constructor, usamos el prototipo:
// Por ejemplo:
// function Persona(nombre, apellido) {
//     this.nombre = nombre;
//     this.apellido = apellido;
// }

// Persona.prototype.nombreCompleto = function() {
//     return `${this.nombre}, ${this.apellido}`;
// }

// let p = new Persona("Juan", "Pérez");
// console.log(p.nombreCompleto());


// Agregamos un método al prototipo de Array para mostrar sus elementos
Array.prototype.mostrar = function() {
    this.forEach(x => console.log(x));
};

[1, 2, 3, 4].mostrar();

// Implementamos un método map personalizado en el prototipo de Array
Array.prototype.mapear = function(callback) {
    let nuevoArray = [];
    for(let i = 0; i < this.length; i++) {
        nuevoArray.push(callback(this[i], i, this));
    }
    return nuevoArray;
};

[1, 2, 3, 4].mapear(x => x * 2).mostrar();

// Implementamos un método filter personalizado en el prototipo de Array
Array.prototype.filtrar = function(callback) {
    let nuevoArray = [];
    for(let i = 0; i < this.length; i++) {
        if(callback(this[i], i, this)) {
            nuevoArray.push(this[i]);
        }
    }
    return nuevoArray;
};
console.clear();
[1, 2, 3, 4].filtrar(x => x > 2).mapear(x => x * 2).mostrar();