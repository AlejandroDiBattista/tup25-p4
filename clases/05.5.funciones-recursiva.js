/// FUNCIONES RECURSIVAS
//
// Funciones que se llaman a si misma.
//   resuelve un problema dividiendolo en subproblemas mas pequeños
//   Deben tener una condicion de parada para evitar un bucle infinito

// Ejemplo:
//      Factorial (n! es el producto de todo los numero de 1 a n)
//      n! = 1*2*3*...*n
//      5! = 1*2*3*4 * 5 = 4! * 5 = 120
//      4! = 1*2*3*4     = 24
//
// Generalizando...
//      0! = 1              // Caso base, condicion de parada.
//      n! = n * (n-1)!     // Caso recursivo, la funcion se llama a si misma con un problema mas pequeño


// Funcion recursiva: Funcion que se llama a si misma
function factorial(n) {
    if(n == 0) return           // Condicion de parada
    return n * factorial(n - 1) // Llamada recursiva con un problema más pequeño
}


/// Busqueda binaria o busqueda dicotómica sobre un array ordenado ///

// Divido el array en dos mitades, el valor esta en el medio lo encontre... sino lo busco en la mitad correspondiente
function buscar(lista, valor, comparador, min=0, max = lista.length-1){
    if(min > max)                               // Condicion de parada -> Sin encontrar
        return false                  
    
    let medio = Math.floor((min + max) / 2)     
    if(comparador(lista[medio], valor) === 0)   // Condicion de parada -> Encontrado
        return true

    if(comparador(valor, lista[medio]) < 0) {   // Reducir el problema a la mitad derecha
        return buscar(lista, valor, comparador, min, medio - 1) // Busca en los menores
    } else {
        return buscar(lista, valor, comparador, medio + 1, max) // Busca en los mayores
    }
}

// Función comparadora...
//  < 0 -> a < b
//  = 0 -> a === b
//  > 0 -> a > b

let comparador = (a, b) => a - b // Truco!! para comparar numeros se puede usar `-`
// {
//     if(a === b) return a - b
//     if (a < b) return a - b
//     return a - b
// }

let c = [5, 7, 10, 20, 30, 40] // Si no esta ordenado... no funciona!
b = buscar(c, 20, comparador)



/// Comparar strings y ordenar ///
// Usa orden lexicografico (ordeen del diccionario - unicode)
let nombres = ["Ana", "Luis",  "Maria", "Pedro"]

// locateCompare -> compara strings teniendo en cuenta reglas de idioma
// 'es' -> Español
// { sensitivity: 'base' } -> Ignora mayusculas y tildes

let compararNombres = (a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })
nombres.sort(compararNombres) // Ordena el array in place

// Buscar con comparador de strings
b = buscar(nombres, "Pedro", compararNombres)
console.log("Existe Pedro?", b)


/// ARBOL BINARIO DE BUSQUEDA ///
// Estructura de datos recursiva
// Funciones recursivas para agregar y mostrar

let raiz = {}                                       // Comenzamos con un árbol vacío (definiendo la raíz)

// Agregar un valor a la raíz del árbol.
function agregar(raiz, valor) {
    if (!raiz.valor)
        raiz = Object.assign(raiz, {valor, menor: {}, mayor: {}})                     // Si la raíz está vacía
    else if (valor < raiz.valor)                    // Si el valor es menor que el de la raíz
        agregar(raiz.menor, valor)                  // Lo agregamos recursivamente en el subárbol izquierdo
    else
        agregar(raiz.mayor, valor)                  // Lo agregamos recursivamente en el subárbol derecho
}

function mostrar(raiz) {
    if (!raiz?.valor) return                        // Si no tiene un valor

    mostrar(raiz.menor)                             // Mostramos los menores
    console.log(raiz.valor)                         // Mostramos el valor
    mostrar(raiz.mayor)                             // Mostramos los mayores
}


console.clear()
agregar(raiz, 4)
agregar(raiz, 2)
agregar(raiz, 1)
agregar(raiz, 3)
agregar(raiz, 6)
agregar(raiz, 5)

mostrar(raiz)