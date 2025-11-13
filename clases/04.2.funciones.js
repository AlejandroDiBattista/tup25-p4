/// FUNCIONES ///

// Las funciones permiten ejecutar código arbitrario. Se definen con la palabra clave `function` y pueden recibir parámetros y devolver valores.

function saludar(nombre) {
    return `Hola, ${nombre}!`;
}

// Para llamarlas (invocarlas) basta con pasarles argumentos:
let a = saludar('Juan'); 
//> a = "Hola, Juan!"


// Las funciones pueden o no recibir parametros y pueden o no devolver valores. 
// Si no se especifica un valor de retorno, la función devuelve `undefined` por defecto.
function log(texto) {
    console.log(`[Log: ${new Date().toISOString()}] ${texto}`);
    // No devuelve nada // return undefined;
}

// Llamar a la función produce un efecto (secundario) que consiste en mostrar en consola un `log` (pista de depuración)
log('Este es un mensaje de log');
//> [Log: 2023-03-15T12:34:56.789Z] Este es un mensaje de log


// Las funciones permite abstraer el codigo lo que lo hace mas facil de usar (y reutilizar)
// Cuando las funciones solo realizan un calculo a partir de los parametros de entrada y no producen ningun efecto secundario (como afectar a una variable global o producir un ejecto en pantalla o en un archivo, etc) se las llama `funciones puras`.

// Las funciones puras, a diferencia de las impuras, siempre devuelven el mismo resultado dado el mismo conjunto de entradas y no dependen de estados externos. Esto las hace más predecibles y fáciles de probar.
function sumar(a, b) {
    return a + b;
}

// Es un ejemplo de funcion pura.
let r = sumar(2, 3); 

// En cambio esta funcion no es pura porque depende de una variable externa (global) y afecta su valor.
// Si la llamo una vez tengo un resultado, si la llamo otra vez tengo otro resultado.

let suma = 0;
function acumular(numero) {
    suma += numero;  
    return suma;
}

acumular(5);
//> 5
acumular(5);
//> 10

// Idealmente las funciones deberian tener una unica tarea y deberia distinguir entre funciones puras que hacen calculos y procedimientos que producen un efecto en el mundo (pero no retorna valores)


// Las funciones pueden recibir multiples argumentos. Una particularidad de JS es que el numero de parametros con los que se llaman pueden no coincidir con el numero de parametros definidos en la funcion.

// Se se pone de mas se ignora, si se pone de menos se asigna `undefined`

function sumar3(a, b, c){
    return a + b + c;
}

let c = sumar3(1, 2, 3);
c = sumar3(4, 5); 
//> 4 + 5 + undefined -> NaN

// Si no se pasa un parametro, su valor es `undefined`
// Podemos asignar un valor por defecto si el parametro es undefined
function sumar4(a, b, c, d){
    a = a ?? 0 // Asigne 0 si es undefined (o null)
    b = b ?? 0
    c = c ?? 0
    d = d ?? 0
    return a + b + c + d;
}

// O sea que si no se pasa un parametro, se toma 0
c = sumar4(1, 2, 3, 4) // > 10
c = sumar4(1, 2, 3)    // > 6
c = sumar4(1)          // > 1
c = sumar4()           // > 0


// Tambien se pueden poner valores por defecto
function sumar5(a = 0, b = 0, c = 0, d = 0) {
    return a + b + c + d;
}

// Esto es equivalente a sumar4 pero aprovecha la sintaxis de JS para asignar valores por defecto a los parametros.

c = sumar5(1, 2, 3, 4) // > 10

// c = sumar5(1,,,4) 
//> 5 // ERROR no se pueden omitir argumentos intermedios, solo los finales.

// Caso especial.... arguments 
// Existe una variable `magica` que toma todos los paremetros y los trata como un array...

// arguments: variable `magica` dentro de las funciones que contiene todos los argumentos pasados a la función.
// No es un array real, pero se comporta como tal en muchos casos (tiene length y se puede acceder por indice)
function sumarTodos() {
    let suma = 0;
    for(let x of arguments) {
        suma += x;
    }
    return suma;
}

// Asi puedo pasarle cualquier cantidad de parametros
c = sumarTodos(1, 2, 3, 4, 5);
c = sumarTodos(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);



// JS solo acepta parametros posicionales (la posicion en la llamada define a que variable asigno el valor) pero 
// podemos usar desestructuracion para `simular` parametros nombrados.

// Le pasamos un objeto, extraemos los datos al mostrar
function nombreCompleto( datos ){ // Recibimos un objeto (datos se repite 3 veces)
    return `${datos.nombre} ${datos.apellido}`;
}

// Extrae los valores en variables temporales
function nombreCompleto( datos ){  // datos se repite 3 veces y nombre/apellido 2
    let nombre   = datos.nombre;   // Lo guardamos en variables temporales
    let apellido = datos.apellido; // Mas laborioso que mas claro en el uso.
    return `${nombre} ${apellido}`;
}

// Extrae los valores temporales usando desestructuracion
function nombreCompleto( datos ){ // menos repeticiones
    let {nombre, apellido} = datos; // Nos aprovechamos de la desestructuracion.
    return `${nombre} ${apellido}`;
}

// Extrae los valores en los parametros (menos repeticion aun)
function nombreCompleto( datos ){ // datos se repite 2 veces
    let {nombre, apellido} = datos; 
    return `${nombre} ${apellido}`;
}

// Tambien puede recibir array (parametros varicionales)
function log(...parametros) {
    console.log('[LOG]', ...parametros)
}

// Y por supuesto combinaciones
// Dos parametros normales y el resto en un array
function sumarFlexible(a, b,...resto){
    return a + b + resto.reduce((acc, curr) => acc + curr, 0);
}
// a y b son obligatorios, resto es opcional (y puede ser tantos como se desee)

// Paso a traves... (recibe parametros y se lo pasa al componente)
c = sumarFlexible(1, 2, 3, 4, 5);
// > 15

// Por ejemplo en React (que veremos mas adelante) se usan mucho los parametros por desestructuracion y el operador `...` para pasar parametros a componentes.

// Componente que muestra un nombre completo y recibe parametros por desestructuracion
function NombreCompleto({nombre, apellido}, ...resto) {
    return <div {...resto}>{nombre} {apellido}</div>;
}

// Despues se puede usar asi:
<NombreCompleto nombre="Juan" apellido="Pérez" className="nombre-completo" style={{color: 'blue'}} />
// Que se traduce a 

// o incluso 
let persona = {nombre: "Ana", apellido: "Gómez"};
let estilo  = {color: 'red'};
<NombreCompleto {...persona} className="nombre-completo" style={estilo} />
NombreCompleto({...persona, style: estilo});


// Tambien se puede retornar multiples valores.
// Retorna un array con los valores
function divMod(a,b){
    return [Math.floor(a/b), a % b];
}

// Lo recibo en un array
c = divMod(5,2); // Recibe un array
console.log(c[0], c[1]) 
//> 2, 1

// Pero se puede hacer mas facil
// Desestructuro el array en variables
[a, b] = divMod(5, 2);
console.log(a, b); 
//> 2, 1

// Tambien se puede hacer con objetos
function crearProfesor(){
    return {nombre: "Juan", apellido: "Pérez", edad: 30};
}


({nombre, apellido }) = crearProfesor(); // Observe que se ignora `edad`

