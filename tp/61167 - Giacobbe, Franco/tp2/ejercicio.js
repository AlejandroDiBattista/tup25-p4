'use strict';
// Funciones generales
let $ = (selector) => document.querySelector(selector);

$("#btnAgregarContacto").onclick = () => {
    $("#agregarContactoForm").showModal();
}

$("#btnCancelar").onclick = () => {
    $("#agregarContactoForm").close();
}