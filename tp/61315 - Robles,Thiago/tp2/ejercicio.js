'use strict';


// DOM


//Modales
const modalAgregar = document.getElementById('modal-agregar');


//Botones
const btnAgregar = document.getElementById('btn-agregar');

// Funciones generales

// Al hacer click en "Agregar contacto", se abre el modal
btnAgregar.addEventListener('click', () => {    
    modalAgregar.showModal();
});







class Agenda {

    static idAutoincrementable = 1;
    constructor(){
        this.contactos = [];
    }

}

class Contacto {
    constructor(nombre, apellido, telefono, email){
        this.id = Agenda.idAutoincrementable++;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }





}