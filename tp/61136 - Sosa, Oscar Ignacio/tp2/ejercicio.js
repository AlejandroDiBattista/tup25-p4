class Contacto {
  constructor({id, nombre, apellido, telefono, email}) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
  }
}

class Agenda {
  constructor() {
    this.contactos = [];
    this.ultimoId = 0;
  }

  agregar(datos) {
    const contacto = new Contacto({
      id: ++this.ultimoId,
      ...datos
    });
    this.contactos.push(contacto);
  }

  actualizar(id, datos) {
    const c = this.contactos.find(c => c.id === id);
    if (c) Object.assign(c, datos);
  }

  borrar(id) {
    this.contactos = this.contactos.filter(c => c.id !== id);
  }

  buscar(texto) {
    texto = normalizar(texto);
    return this.contactos.filter(c =>
      normalizar(c.nombre).includes(texto) ||
      normalizar(c.apellido).includes(texto) ||
      normalizar(c.telefono).includes(texto) ||
      normalizar(c.email).includes(texto)
    );
  }

  ordenar() {
    this.contactos.sort((a, b) => {
      const apA = normalizar(a.apellido), apB = normalizar(b.apellido);
      if (apA === apB) return normalizar(a.nombre).localeCompare(normalizar(b.nombre));
      return apA.localeCompare(apB);
    });
  }
}

// Normaliza texto para búsqueda insensible a mayúsculas y acentos
function normalizar(txt) {
  return txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// --- UI LOGIC ---
const agenda = new Agenda();
let modoEdicion = false;

// Cargar 10 contactos de ejemplo
function cargarEjemplo() {
  const ejemplos = [
    {nombre:"Juan",apellido:"Pérez",telefono:"3815551234",email:"jperez@gmail.com"},
    {nombre:"José",apellido:"Gómez",telefono:"3815551235",email:"jgomez@gmail.com"},
    {nombre:"Pedro",apellido:"Sánchez",telefono:"3815551236",email:"psanchez@gmail.com"},
    {nombre:"Ana",apellido:"López",telefono:"3815551237",email:"alopez@gmail.com"},
    {nombre:"María",apellido:"Rodríguez",telefono:"3815551238",email:"mrodriguez@gmail.com"},
    {nombre:"Luis",apellido:"Fernández",telefono:"3815551239",email:"lfernandez@gmail.com"},
    {nombre:"Laura",apellido:"Martínez",telefono:"3815551240",email:"lmartinez@gmail.com"},
    {nombre:"Sofía",apellido:"García",telefono:"3815551241",email:"sgarcia@gmail.com"},
    {nombre:"Miguel",apellido:"Torres",telefono:"3815551242",email:"mtorres@gmail.com"},
    {nombre:"Lucía",apellido:"Ramírez",telefono:"3815551243",email:"lramirez@gmail.com"}
  ];
  ejemplos.forEach(e => agenda.agregar(e));
  agenda.ordenar();
}
cargarEjemplo();

// --- DOM Elements ---
const listado = document.getElementById('listado');
const buscador = document.getElementById('buscador');
const btnAgregar = document.getElementById('btnAgregar');
const dialogo = document.getElementById('dialogo');
const formulario = document.getElementById('formulario');
const cancelar = document.getElementById('cancelar');

// --- Render ---
function renderLista(filtro = "") {
  let contactos = filtro ? agenda.buscar(filtro) : agenda.contactos;
  agenda.ordenar();
  listado.innerHTML = contactos.map(c => `
    <article>
      <strong>${c.apellido}, ${c.nombre}</strong><br>
      <small>Tel: ${c.telefono} | Email: ${c.email}</small>
      <nav>
        <button onclick="editarContacto(${c.id})" aria-label="Editar">✏️</button>
        <button onclick="borrarContacto(${c.id})" aria-label="Borrar">🗑️</button>
      </nav>
    </article>
  `).join('');
}
window.editarContacto = function(id) {
  const c = agenda.contactos.find(c => c.id === id);
  if (!c) return;
  formulario.id.value = c.id;
  formulario.nombre.value = c.nombre;
  formulario.apellido.value = c.apellido;
  formulario.telefono.value = c.telefono;
  formulario.email.value = c.email;
  modoEdicion = true;
  dialogo.showModal();
};
window.borrarContacto = function(id) {
  agenda.borrar(id);
  renderLista(buscador.value);
};

// --- Eventos ---
btnAgregar.onclick = () => {
  formulario.reset();
  formulario.id.value = "";
  modoEdicion = false;
  dialogo.showModal();
};
cancelar.onclick = () => dialogo.close();
formulario.onsubmit = e => {
  e.preventDefault();
  const datos = {
    nombre: formulario.nombre.value,
    apellido: formulario.apellido.value,
    telefono: formulario.telefono.value,
    email: formulario.email.value
  };
  if (modoEdicion && formulario.id.value) {
    agenda.actualizar(Number(formulario.id.value), datos);
  } else {
    agenda.agregar(datos);
  }
  dialogo.close();
  renderLista(buscador.value);
};
buscador.oninput = () => renderLista(buscador.value);

// Inicializa la lista
renderLista();