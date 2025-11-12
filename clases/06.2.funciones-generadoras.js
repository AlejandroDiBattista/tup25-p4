// Funciones generadoras
// Son funciones que pueden pausar su ejecucion y luego reanudarla
// Se definen con function* y usan la palabra clave yield para pausar
// Al llamarlas, no se ejecutan inmediatamente, sino que devuelven un objeto iterador


function* pares(){
    yield 2;
    yield 4;
    yield 6;
}

console.log(pares()); // Muestra el objeto generador

let generador = pares();
console.log("--------------------------------");
console.log("\n> Iteraciones del generador:");
console.log(`- ${generador.next()}`); // { value: 2, done: false }
console.log(`- ${generador.next()}`); // { value: 4, done: false }
console.log(`- ${generador.next()}`); // { value: 6, done: false }
console.log(`- ${generador.next()}`); // { value: undefined, done: true }

// Podemos usar un bucle for...of para iterar sobre los valores generados
console.log("\n> Iterando con for...of:");
for (let numero of pares()) {
    console.log(`- ${numero}`); // 2, luego 4, luego 6
}

// Podemos combinar yield con lógica dentro de la función generadora
console.log("\n> Generador con lógica intermedia:");
function *rango(from, to){
    for(let i = from; i <= to; i++){
        yield i;
    }
}


console.log("\n> Rango de 3 a 7:");
for(let x of rango(3,7)){
    console.log(`- ${x}`); // 3, 4, 5, 6, 7
}

