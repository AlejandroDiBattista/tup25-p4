# Conversión de clase4.js a Markdown

Funciones

Las funciones permiten ejecutar código arbitrario. Se definen con la palabra clave `function` y pueden recibir parámetros y devolver valores.

```javascript
function saludar(nombre) {
  return `Hola, ${nombre}!`;
}
```

Para llamarlas (invocarlas) basta con pasarles argumentos:

```javascript
let a = saludar('Juan'); 
```
```bash
a = "Hola, Juan!"
```

Las funciones pueden o no recibir parametros y pueden o no devolver valores.  
Si no se especifica un valor de retorno, la función devuelve `undefined` por defecto.

```javascript
function log(texto) {
    console.log(`[Log: ${new Date().toISOString()}] ${texto}`);
    // No devuelve nada
}
```

Llamar a la función produce un efecto (secundario) que consiste en mostrar en consola un `log` (pista de depuración)

```javascript
log('Este es un mensaje de log');
```
```bash
[Log: 2023-03-15T12:34:56.789Z] Este es un mensaje de log
```

Las funciones permite abstraer el codigo lo que lo hace mas facil de usar (y reutilizar)
Cuando las funciones solo realizan un calculo a partir de los parametros de entrada y no producen ningun efecto secundario (como afectar a una variable global o producir un ejecto en pantalla o en un archivo, etc) se las llama `funciones puras`.

Las funciones puras, a diferencia de las impuras, siempre devuelven el mismo resultado dado el mismo conjunto de entradas y no dependen de estados externos. Esto las hace más predecibles y fáciles de probar.

```javascript
function sumar(a, b) {
    return a + b;
}
```

Es un ejemplo de funcion pura.

En cambio 

```javascript
const Incremento = 1
function incrementar(numero) {
    return numero + Incremento;
}
```

Depende de un valor externo... 

```javascript
let b = incrementar(10); 
```
```bash
b = 11
```

El resultado no es previsible. 

```javascript
let suma = 0
function acumular(numero) {
    suma += numero
    return suma
}
```
Si la llamo una segunda vez tengo otro resultado.

```javascript
acumular(5);
```
```bash
5
```
```javascript
acumular(5);
```
```bash
10
```

Idealmente las funciones deberian tener una unica tarea y deberia distinguir entre funciones puras que hacen calculos y procedimientos que producen un efecto en el mundo (pero no retorna valores)

Las funciones pueden recibir multiples argumentos. Una particularidad de JS es que el numero de parametros con los que se llaman pueden no coincidir con el numero de parametros definidos en la funcion.

Se se pone de mas se ignora, si se pone de menos se asigna `undefined`

```javascript
function sumar3(a,b,c){
    return a + b + c;
}

let c = sumar3(1, 2, 3);
c = sumar3(4, 5); 
```
```bash
4 + 5 + undefined -> NaN
```

```javascript
function sumar4(a,b,c,d){
    a = a ?? 0 // Asigne 0 si es undefined (o null)
    b = b ?? 0
    c = c ?? 0
    d = d ?? 0
    return a + b + c + d;
}

c = sumar4(1, 2, 3, 4) // > 10
c = sumar4(1, 2, 3)    // > 6
c = sumar4(1)          // > 1
c = sumar4()           // > 0
```

Tambien se pueden poner valores por defecto

```javascript
function sumar5(a = 0, b = 0, c = 0, d = 0) {
    return a + b + c + d;
}
```

Esto es equivalente a sumar4 pero aprovecha la sintaxis de JS para asignar valores por defecto a los parametros.

```javascript
c = sumar5(1, 2, 3, 4) // > 10
// c = sumar5(1,,,4) 
```
```bash
5 // ERROR no se pueden omitir argumentos intermedios, solo los finales.
```

Caso especial.... arguments 
Existe una variable `magica` que toma todos los paremetros y los trata como un array...

```javascript
function sumarTodos() {
    let suma = 0;
    for(let x of arguments) {
        suma += x;
    }
    return suma;
}

c = sumarTodos(1, 2, 3, 4, 5);
c = sumarTodos(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
```

JS solo acepta parametros posicionales (la posicion en la llamada define a que variable asigno el valor) pero 
podemos usar desestructuracion para `simular` parametros nombrados.

```javascript
function nombreCompleto( datos ){ // Recibimos un objeto (datos se repite 3 veces)
    return `${datos.nombre} ${datos.apellido}`;
}

function nombreCompleto1( datos ){  // datos se repite 3 veces y nombre/apellido 2
    let nombre   = datos.nombre;   // Lo guardamos en variables temporales
    let apellido = datos.apellido; // Mas laborioso que mas claro en el uso.
    return `${nombre} ${apellido}`;
}

function nombreCompleto2( datos ){ // menos repeticiones
    let {nombre, apellido} = datos; // Nos aprovechamos de la desestructuracion.
    return `${nombre} ${apellido}`;
}

function nombreCompleto3( {nombre, apellido} ){ // Super simple... explicito al recibir (sin `datos` y con la repeticion minima)
    return `${nombre} ${apellido}`;
}

let datos = {nombre: "Juan", apellido: "Pérez"};
c = nombreCompleto(datos); 
```
```bash
"Juan Pérez"
```
```javascript
c = nombreCompleto1(datos); 
```
```bash
"Juan Pérez"
```
```javascript
c = nombreCompleto2(datos); 
```
```bash
"Juan Pérez"
```
```javascript
c = nombreCompleto3(datos); 
```
```bash
"Juan Pérez"
```
```javascript
c = nombreCompleto3({nombre: "Ana", apellido: "Gómez"}); 
```
```bash
"Ana Gómez"
```
```javascript
c = nombreCompleto3({apellido: "Gómez", nombre: "Ana", }); 
```
```bash
"Ana Gómez"
```

```javascript
function nombreCompleto4( {nombre, apellido, edad} = datos = {} ){ // Podemos agregar un parametro mas con valor por defecto
    datos = [ {edad: 20,  : "Juan", apellido: "Pérez"}, ...datos];
    return `${nombre} ${apellido} (${edad} años)`;
}
```

Tambien puede recibir array (parametros varicionales)

```javascript
function log(...parametros) {
    console.log('[LOG]', ...parametros)
}
```

Y por supueto conbinaciojnes 

```javascript
function sumarFlexible(a, b,...resto){
    return a + b + resto.reduce((acc, curr) => acc + curr, 0);
}
// a y b son obligatorios, resto es opcional (y puede ser tantos como se desee)

// Paso a traves... (recibe parametros y se lo pasa al componente)
c = sumarFlexible(1, 2, 3, 4, 5);
```
```bash
15
```

Por ejemplo en React

```javascript
function NombreCompleto({nombre, apellido}, ...resto) {
    return <div {...resto}>{nombre} {apellido}</div>;
}
```

Despues se puede usar asi:

```javascript
<NombreCompleto nombre="Juan" apellido="Pérez" className="nombre-completo" style={{color: 'blue'}} />
```

Que se traduce a 

O incluso 

```javascript
let persona = {nombre: "Ana", apellido: "Gómez"};
let estilo  = {color: 'red'};
<NombreCompleto {...persona} className="nombre-completo" style={estilo} />
NombreCompleto({...persona, style: estilo});
```

Tambien se puede retornar multiples valores.

```javascript
function divMod(a,b){
    return [Math.floor(a/b), a % b];
}

c = divMod(5,2); // Recibe un array
console.log(c[0], c[1]) 
```
```bash
2, 1
```

Pero se puede hacer mas facil

```javascript
[a, b] = divMod(5, 2);
console.log(a, b); 
```
```bash
2, 1
```

Tambien se puede hacer con objetos

```javascript
function crearProfesor(){
    return {nombre: "Juan", apellido: "Pérez", edad: 30};
}

const [contador, setContador] = useState();

let {nombre, apellido } = crearProfesor(); // Observe que se ignora `edad`
```

Modulos 

Los modulos son archivos que exportan e importan funcionalidades (variables, funciones, clases, etc.) para ser reutilizadas en otros archivos. Sirve para organizar el codigo de manera que oculte los detalles de implementacion y se use por su funcionalidad.
Tambien se suelen llamar librerias.

Las variables funciones, clases etc que se definen en un modulo no se pueden usar afuera  
son globales en el sentido que existen mientras el modulo esta cargado (o sea siempre)  
pero no se puede acceder externamente si no se lo solicita 

Agenda.js ----

```javascript
const agenda = [];

function agregarContacto(contacto) {
    agenda.push(contacto);
}

function listarContactos() {
    return agenda;
}

function buscar(nombre) {
    return agenda.find(contacto => contacto.nombre === nombre);
}

export { agregarContacto as agregar, listarContactos as listar, buscar };
```

Y despues se puede usar importando el modulo...

```javascript
import Agenda from './Agenda.js';

Agenda.agregar({ nombre: 'Juan', telefono: '123456789' });
Agenda.agregar({ nombre: 'Ana',  telefono: '987654321' });
console.log("Listar contactos:")
for(let c of Agenda.listar()) {
    console.log(c);
}
console.log("Existe 'Juan'? ", Agenda.buscar('Juan'));
```
```bash
Listar contactos:
"Juan Pérez"
"Ana Gómez"
Existe 'Juan'? true;
```

Aca Agenda funciona como un `namespace` (espacio de nombres, encapsulando la funcionalidad relacionada)

Se pueden importar las funciones individuales...

```javascript
import {agregar, buscar as search} from './Agenda.js'; // Note que importamos `buscar` pero con el nombre `search`

agregar({ nombre: 'Pedro', telefono: '555555555' });
console.log("Existe 'Pedro'? ", search('Pedro'));
```
```bash
Existe 'Pedro'? true;
```

```javascript
export function borrarContacto(nombre) { 
    //...
}
```
