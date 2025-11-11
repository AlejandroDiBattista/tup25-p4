/// Funciones para trabajar con arreglos (arrays)

// Definición de un arreglo
let a = [10, 20, 5, 30, 7]


// Algoritmo para recorrer el arreglo
for(let i = 0; i < a.length; i++) {
  console.log(a[i])
}

// La implemento como función para que sea más comprensible
function mostrarArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}   

// Otra función que hace lo mismo pero muestra los datos de forma diferente
function mostrarArrayDoble(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(`Doble de ${i} es ${arr[i] * 2}`);
    }
}   


// Podemos usar una función genérica para resolver distintos recorridos
// aplicar: generaliza el comportamiento al recorrer
function mostrar(lista, aplicar){
    console.log("Recorriendo la lista:");
    for(let x of lista) {
        aplicar(x);
    }
}

// Recorrer el arreglo 'a'
mostrar(a, x => console.log(x))     // Usando una funcion flecha
mostrar(a, console.log)             // Pasando la funcion console.log directamente

// Usando la función genérica para mostrar el doble
mostrar(a, x => console.log(`Doble de ${x} es ${x * 2}`))

// ATENCIÓN: se puede agregar una función a clases existentes
Array.prototype.recorrer = function(aplicar) {
    for(let x of this) {
        aplicar(x);
    }
}

// Otro ejemplo, usando la función recorrer del prototipo de Array
let mostrarDoble = x => console.log(`Doble de ${x} es ${x * 2}`);
a.recorrer(mostrarDoble)



// Algunos patrones (algoritmos comunes) básicos para trabajar con listas
// Copiar una lista...
// lista -> nuevaLista
function copiar(lista) {
    let nuevaLista = [];                // Creo una nueva lista
    for(let x of lista) {               // Recorro la lista original
        nuevaLista.push(x);             // Agrego cada elemento a la nueva lista
    }
    return nuevaLista;                  // Devuelvo la nueva lista
}

// Copiar transformando los datos (mapeo)
function mapear(lista, transformar) {
    let nuevaLista = [];
    for(let x of lista) {
        let y = transformar(x);         // Transforma el dato usando la función `transformar`
        nuevaLista.push(y);
    }
    return nuevaLista;
}

// Copiar seleccionando (filtrando)
function filtrar(lista, condicion) {
    let nuevaLista = [];
    for(let x of lista) {
        if(condicion(x)) {              // Si el elemento cumple con la condición
            nuevaLista.push(x);         // Lo agrego a la nueva lista
        }
    }
    return nuevaLista;
}

// Buscar un elemento que cumpla una condición
// lista -> valor 
function find(lista, condicion){
    for(let x of lista) 
        if(condicion(x)) 
            return x;   
    return undefined;
}

// Buscar la posición de un elemento que cumpla una condición
function findIndex(lista, condicion){
    for(let i = 0; i < lista.length; i++) 
        if(condicion(lista[i])) 
            return i;
    return -1;
}

// Procesar una lista: array -> valor

// Sumador: acumula sumando
function sumar(lista) {
    let total = 0;
    for(let x of lista) 
        total = total + x;
    return total;
}

// Multiplicador: acumula multiplicando
function multiplicar(lista) {
    let total = 1;
    for(let x of lista)
        total = total * x;
    return total;
}

// Reductor: acumula aplicando una función
function reducir(lista, transformar, inicial) {
    let total = inicial;
    for(let x of lista) 
        total = transformar(total, x);
    return total;
}

let suma = (a,b) => a + b;
let producto = (a,b) => a * b;
let c = reducir(a, suma, 0);

c = reducir(a, suma, 0);
c = reducir(a, producto, 1);

let b = filtrar(a, x => x > 10);
mostrar(b, console.log)


// Ordenar una lista

// Mientras existan elementos desordenados, acomodarlos e intentar nuevamente
function ordenarSimple(lista) {

    function esOrdenado(lista){
        for(let i = 0; i < lista.length - 1; i++) 
            if(lista[i] > lista[i + 1]) // Si encuentro un par desordenado
                return false;
        return true;
    }

    function acomodar(lista) {
        for(let i = 0; i < lista.length - 1; i++) 
            if(lista[i] > lista[i + 1]) // Si encuentro un par desordenado
                [lista[i], lista[i + 1]] = [lista[i + 1], lista[i]]; // Lo acomodo
    }

    while (!esOrdenado(lista))
        acomodar(lista);

    return lista;
}



