// Funcion como sentencia
function sumar(a, b) {
    return a + b
}

// Funcion como expresion o Funcion Anonima
let suma = function(a, b){
    return a + b
}

// Funcion flecha o funcion lambda
let resta = (a, b) => a - b
let incrementar = a => a + 1


// Dado una lista de numeros... 
let a = [10, 30, 20, 5, 40, 7]

// Funcion para mostrar elementos
// Le pasamos una funcion para definir como mostrar cada elemento
// Funciones de orden superior... funciones que reciben otras funciones como argumentos
function mostrar(a, f = x => x) {
    console.log("Recorriendo...")
    for(let i = 0; i < a.length; i++) {
        console.log(f(a[i]))
    }
}

// Una funcion generica... 
// Recorrer la lista y aplicar la funcion a cada elemento
function recorrer(lista, f) {
    for(let x of lista) { // Recorremos la lista con for... of
        f(x)
    }
}

// Una par de funciones 
let doble = x => x * 2
let cubo  = x => x ** 3 // `**` es potencia


// Utilizamos la funcion mostrar para aplicar a distintas funciones
mostrar(a, doble)   
mostrar(a, cubo)    

// Ya existe una funcion en JS que permite recorrer una lista y aplicar una funcion a cada elemento
a.forEach(x => console.log(x * 2))

// Veamos algunos patrones (algoritmos basicos)

// Esta funcion copia una lista
// Creo un array, recorro la lista y voy agregando elementos, retorno la lista.
function copiar(lista) {
    let nuevaLista = []    // Creamos un nuevo array
    for(let x of lista) {   // Recorremos la lista original
        nuevaLista.push(x) // Agregamos el elemento a la nueva lista
    }
    return nuevaLista      // Retornamos la nueva lista
}


// Copia todos los elementos de una lista aplicando una funcion de transformacion
function mapear(lista, transformar) {
    let nuevaLista = []
    for(let x of lista) {
        let y = transformar(x)
        nuevaLista.push(y)
    }
    return nuevaLista
}

mostrar(mapear(a, x => x * 2))

// Ya existe una funcion pero se aplica a los arrays
let b = a.map(x => x * 2)

// Copia todos los elementos de una lista aplicando una funcion de filtrado
function filtrar(a, criterio) {
    let nuevaLista = []
    for(let x of a) {
        if(criterio(x)) {
            nuevaLista.push(x)
        }
    }
    return nuevaLista
}

// Un par de funciones utiles
let par   = x => x % 2 == 0  // Los numeros pares son los que al dividir por 2 el resto es 0
let impar = x => x % 2 != 0

// Filtramos los elementos pares
b = filtrar(a, par)
mostrar(a.filter(par))

// Filtramos los elementos impares (usando las funciones incorporadas)
a.filter(impar).forEach(console.log) // Observar que pasan `console.log` como funcion 

// Buscamos un elemento en la lista
function buscar(lista, cmp) {
    for(let i = 0; i < lista.length; i++) {
        if(cmp(lista[i]) === 0) {
            return i
        }
    }
    return undefined
}

b = buscar(a, 20, comparador)
console.log("Elemento encontrado en la posicion:", b)
b = a.find(x => x === 20)

// Buscamos la posicion del elemento (buscar un valor)
function buscarIndiceConValor(lista, valor) {
    for(let i = 0; i < lista.length; i++) {
        if(lista[i] === valor) {
            return i
        }
    }
    return -1
}

// Buscar mas generico... le pasamos la condicion.
function buscarIndice(lista, condicion) {
    for(let i = 0; i < lista.length; i++) {
        if(condicion(lista[i]) === 0) {
            return i
        }
    }
    return -1
}
let i = buscarIndice(a, x => x == 20) // Podemos hacer una busqueda de un valor
i = buscarIndice(a, x => x > 20)      // pero tambien podemos buscar los elementos que cumple una condicion

// Con las funciones incorporada en JS
i = a.findIndex(x => x > 20)


// Otro patron... acumular un resultado

// Acumula sumando...
function sumador(lista){
    let total = 0           // Inicializamos el acumulador
    for(let x of lista) {       // Recorremos la lista
        total = total + x   // Acumulamos el valor
    }
    return total            // Retornamos un resultado (un valor a partir de una lista)
}

// Acumula multiplicando...
function multiplicador(a){
    let total = 1
    for(let x of a) {
        total = total * x
    }
    return total
}

// Reducir ... reduce una lista a un solo valor
function reducir(lista, f, inicial) {
    let acumulador = inicial
    for(let x of lista) {
        acumulador = f(acumulador, x)
    }
    return acumulador
}

b = reducir(a, (total, x) => total + x, 0)
b = reducir(a, (total, x) => total * x, 1)

// Ya existe una funcion en JS
b = a.reduce((total, x) => total + x, 0)

// Composicion de funciones -> Combinar el uso
// Como se ejecuta primera lo que esta dentro combinar las funciones lleva a anidar el llamado
// dificil de leer // Redusca usando la suma lo que que filtro de haber mapeado 
b = reducir( filtrar( map(a, x => x * 2), x => x > 10), suma, 0)

// Mape, filtre y reduzca sumando
b = a.map(x => x * 3)
    .filter(x => x > 10)
    .reduce(suma)

