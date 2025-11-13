/// MODULOS ///

// Los modulos son archivos que exportan e importan funcionalidades (variables, funciones, clases, etc.) para ser reutilizadas en otros archivos. Sirve para organizar el codigo de manera que oculte los detalles de implementacion y se use por su funcionalidad.
// Tambien se suelen llamar librerias.

// Las variables funciones, clases etc que se definen en un modulo no se pueden usar afuera 
// son globales en el sentido que existen mientras el modulo esta cargado (o sea siempre)
// pero no se puede acceder externamente si no se lo solicita 



// agenda.js ----

const agenda = [];

function agregar(contacto) {
    agenda.push(contacto);
}

function listar() {
    return agenda;
}

function buscar(nombre) {
    return agenda.find(contacto => contacto.nombre === nombre);
}

// Exporta un `objeto` (es esta caso tambien renombra los metodos a exportar)
export { agregar, listar, buscar };


// ----
// Y despues se puede usar importando el modulo...
// main.js ----
import Agenda from './agenda.js';

Agenda.agregar({ nombre: 'Juan', telefono: '123456789' });
Agenda.agregar({ nombre: 'Ana',  telefono: '987654321' });
console.log("Listar contactos:")
for(let c of Agenda.listar()) {
    console.log(c);
}

console.log("Existe 'Juan'? ", Agenda.buscar('Juan'));
//> Listar contactos:
//> "Juan Pérez"
//> "Ana Gómez"
//> Existe 'Juan'? true;


// Aca Agenda funciona como un `namespace` (espacio de nombres, encapsulando la funcionalidad relacionada)

// Se pueden importar las funciones individuales...

// Se pueden importar las funciones individuales e incluso renombrarlas
import {agregar, buscar as search} from './Agenda.js'; // Note que importamos `buscar` pero con el nombre `search`

agregar({ nombre: 'Pedro', telefono: '555555555' });
console.log("Existe 'Pedro'? ", search('Pedro'));

//> Existe 'Pedro'? true;
