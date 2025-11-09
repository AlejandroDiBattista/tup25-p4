let $ = (selector) => document.querySelector(selector);

let buscar   = $("#buscar");
let form     = $("form");

let dialogo  = $("#dialogo");
let agregar  = $("#agregar");
let cancelar = $("#cancelar");

const IconoEditar = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`
const IconoBorrar = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser-icon lucide-eraser"><path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/></svg>`


// Asignamos los eventos

agregar.addEventListener("click", () => {
    form.reset();
    form.elements["id"].value = "";
    dialogo.showModal();
});


cancelar.addEventListener("click", () => {
    dialogo.close();
});


form.addEventListener("submit", (ev) => {
    ev.preventDefault(); // Evita el envío del formulario

    const data = getDatos(form);
    const idNum = Number(data.id) || 0;
    
    if(idNum > 0){ // Si tiene id, actualiza
        agenda.actualizar(new Contacto(data));
    } else {       // Si no tiene id, agrega
        agenda.agregar(new Contacto(data));
    }
    
    dialogo.close(); // Cierra el diálogo y limpia el formulario
    form.reset();

    generarAgenda(); // Regenera la agenda con los datos actualizados
});


buscar.addEventListener("input", generarAgenda);


// Funciones auxiliares para obtener y establecer datos del formulario

function getDatos(form){
    return {
        id:       form.elements["id"].value,
        nombre:   form.elements["nombre"].value,
        apellido: form.elements["apellido"].value,
        telefono: form.elements["telefono"].value,
        email:    form.elements["email"].value,
    };
}

function setDatos(form, data){
    form.elements["id"].value       = data.id;
    form.elements["nombre"].value   = data.nombre;
    form.elements["apellido"].value = data.apellido;
    form.elements["telefono"].value = data.telefono;
    form.elements["email"].value    = data.email;
}


// Gestion de los eventos
function alEditar(id){
    const contacto = agenda.traer(+id);
    if(!contacto) return;

    setDatos(form, contacto);
    dialogo.showModal();
    generarAgenda();
}


function alBorrar(id){
    agenda.borrar(+id);
    generarAgenda();
}

// Genera el HTML de la agenda
function generarAgenda(){
    const filtro = buscar?.value ?? "";
    let html = agenda.traerTodos(filtro).map(d => generarContacto(d)).join('');
    $("#lista-contactos").innerHTML = html;
}


// Genera el HTML de un contacto
function generarContacto({id, nombre, apellido, telefono, email}){
    return `
    <article>
        <header>${apellido}, ${nombre}</header>
        <p>📱 ${telefono}</p>
        <p>📧 ${email}</p>
        <span>
            <button class="icono" onclick="alEditar(${id})" >${IconoEditar}</button>
            <button class="icono" onclick="alBorrar(${id})" >${IconoBorrar}</button>
        </span>
    </article>`
}


generarAgenda();