'use strict';



let mensajeError = document.getElementById('mensaje-error');

// === CLASES ===

class Agenda {

    constructor(){
        this.contactos = [];
    }

    agregarContacto(contacto){

        // Validaciones
        if(!contacto.nombre || !contacto.apellido || !contacto.telefono || !contacto.email){
            mensajeError.textContent = 'Todos los campos son obligatorios.';
            return;
        }

        if(this.contactos.some(c => c.email === contacto.email)){
            mensajeError.textContent = 'El email ya está en uso.';
            return;
        }

        if(this.contactos.some(c => c.telefono === contacto.telefono)){
            mensajeError.textContent = 'El teléfono ya está en uso.';
            return;
        }

        this.contactos.push(contacto);
    }

    eliminarContacto(id){
        this.contactos = this.contactos.filter(contacto => contacto.id !== id);
    }

    editarContacto(id, nuevosDatos){

        const contacto = this.contactos.find(contacto => contacto.id === id);
        
        if(contacto){
            contacto.nombre = nuevosDatos.nombre || contacto.nombre;
            contacto.apellido = nuevosDatos.apellido || contacto.apellido;
            contacto.telefono = nuevosDatos.telefono || contacto.telefono;
            contacto.email = nuevosDatos.email || contacto.email;
        }
    }

    buscarContacto(termino){

        const normalizar = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        termino = normalizar(termino);

        return this.contactos.filter(contacto => 
            normalizar(contacto.nombre).includes(termino) || 
            normalizar(contacto.apellido).includes(termino) || 
            normalizar(contacto.telefono).includes(termino) || 
            normalizar(contacto.email).includes(termino)
        );
    }

}

class Contacto {

    static idAutoincrementable = 1;

    constructor(nombre, apellido, telefono, email){
        this.id = Contacto.idAutoincrementable++;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }


}

// ===========================


// === INPUTS ===
// const inputBuscar = document.getElementById('input-buscar');

// === SPANS / PARRAFOS / TITULOS ===
const btnEditar = document.getElementById('btn-editar');
const numeroContacto = document.getElementById('numero-contacto');
const nombreContacto = document.getElementById('nombre-contacto');
const apellidoContacto = document.getElementById('apellido-contacto');
const telefonoContacto = document.getElementById('telefono-contacto');
const emailContacto = document.getElementById('email-contacto');

// ===========================

// === INSTANCIA PRINCIPAL ===

const agenda = new Agenda();

// === DOM ===

const modalAgregar = document.getElementById('modal-agregar');
const formAgregar  = document.getElementById('form-agregar');
const btnAgregar   = document.getElementById('btn-agregar');
const divContactos = document.getElementById('contactos');

// ===========================


// === FUNCIONES ===

// Mostrar contactos en el DOM
const contactos= agenda.contactos;

const mostrarContactos = (contactos) => {
    divContactos.innerHTML = '';
    contactos.forEach(contacto => {
        divContactos.innerHTML += `
        <article>
            <h2> Contacto ${contacto.id} </h2>
            <h3>${contacto.nombre} ${contacto.apellido}</h3>
            <p>Teléfono: ${contacto.telefono}</p>
            <p>Email: ${contacto.email}</p>
            <button class="btn-editar" data-id="${contacto.id}">✏️</button>
            <button class="btn-eliminar" data-id="${contacto.id}">🗑️</button>
        </article>
        `;
    });
};

// ===========================

// === DATOS DE PRUEBA ===

const contacto1 = new Contacto('Juan', 'Pérez', '123456789', 'juan@example.com');
const contacto2 = new Contacto('Ana', 'Gómez', '987654321', 'ana@example.com');
const contacto3 = new Contacto('Luis', 'Martínez', '555666777', 'luis@example.com');
const contacto4 = new Contacto('María', 'Rodríguez', '444555666', 'maria@example.com');
const contacto5 = new Contacto('Carlos', 'López', '222333444', 'carlos@example.com');
agenda.agregarContacto(contacto1);
agenda.agregarContacto(contacto2);
agenda.agregarContacto(contacto3);
agenda.agregarContacto(contacto4);
agenda.agregarContacto(contacto5);

mostrarContactos(agenda.contactos);

// ===========================


// ===== Eventos =====
// Al enviar el formulario de agregar contacto
formAgregar.addEventListener('submit', (e) => {

    e.preventDefault();

    const nombre = formAgregar.elements[0].value;
    const apellido = formAgregar.elements[1].value;
    const telefono = formAgregar.elements[2].value;
    const email = formAgregar.elements[3].value;

    const nuevoContacto = new Contacto(nombre, apellido, telefono, email);

    agenda.agregarContacto(nuevoContacto);
    mostrarContactos(agenda.contactos);
    modalAgregar.close();
    formAgregar.reset();


    console.log(nuevoContacto);
});

// ===================

// === BOTONES ===
const btnformAgregar = document.getElementById('btn-form-agregar'); 

// ===========================

// === EVENTOS ===

// Al hacer click en "Agregar contacto", se abre el modal
btnAgregar.addEventListener('click', () => {    
    modalAgregar.showModal();
});

// Al hacer click en "Editar contacto", se abre el modal
// btnEditar.addEventListener('click', () => {
//     modalEditar.showModal();
// });




 

