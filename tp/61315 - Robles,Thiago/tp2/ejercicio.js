'use strict';

//Clases

class Agenda {

    constructor(){
        this.contactos = [];
    }

    agregarContacto(contacto){
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

    static idAutoincrementable = 0;

    constructor(nombre, apellido, telefono, email){
        this.id = Contacto.idAutoincrementable++;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }

    guardarContactos(){

        Agenda.contactos.push(this.id, this.nombre, this.apellido, this.telefono, this.email);

    }

}


// DOM


//Modales
const modalAgregar = document.getElementById('modal-agregar');

// Formulario Agregar contacto
const formAgregar = document.getElementById('form-agregar');
const btnformAgregar = document.getElementById('btn-form-agregar'); 


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




//Botones
const btnAgregar = document.getElementById('btn-agregar');

// Funciones generales

// Al hacer click en "Agregar contacto", se abre el modal
btnAgregar.addEventListener('click', () => {    
    modalAgregar.showModal();
});


//  Mostrar Contactos

const agenda = new Agenda();
const contactos= agenda.contactos;
const divContactos = document.getElementById('contactos');


const mostrarContactos = (contactos) => {
    contactos.forEach(contacto => {
        divContactos.innerHTML += `
            <h3>${contacto.nombre} ${contacto.apellido}</h3>
            <p>Teléfono: ${contacto.telefono}</p>
            <p>Email: ${contacto.email}</p>
            <button class="btn-editar" data-id="${contacto.id}">Editar</button>
            <button class="btn-eliminar" data-id="${contacto.id}">Eliminar</button>
        `;
    });
};

       

