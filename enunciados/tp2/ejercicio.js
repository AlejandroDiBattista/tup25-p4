'use strict';

// Helpers de selección
const $ = (id) => document.getElementById(id);
const $$ = (selector, root = document) => root.querySelector(selector);

// Elementos UI
const $search = $('search');
const $addBtn = $('addContactBtn');
const $cards = $('cards');
const $empty = $('emptyState');

const $dialog = $('contactDialog');
const $form = $('contactForm');
const $dialogTitle = $('dialogTitle');
const $cancelBtn = $('cancelBtn');

// Campos del formulario
const FIELDS = ['nombre', 'apellido', 'telefono', 'email'];

// Modelo de datos
class Contacto {
  constructor({ id, nombre, apellido, telefono, email }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
  }
}

class Agenda {
  constructor(items = []) {
    this.items = items.map((c) => new Contacto(c));
  }
  agregar(data) {
    const contacto = new Contacto({ id: generarId(), ...data });
    this.items.push(contacto);
    return contacto;
  }
  actualizar(id, patch) {
    const i = this.items.findIndex((c) => c.id === id);
    if (i === -1) return null;
    Object.assign(this.items[i], patch);
    return this.items[i];
  }
  borrar(id) {
    const i = this.items.findIndex((c) => c.id === id);
    if (i === -1) return false;
    this.items.splice(i, 1);
    return true;
  }
  listar() {
    return [...this.items];
  }
  buscarPorId(id) {
    return this.items.find((c) => c.id === id) || null;
  }
}

let agenda;
let editandoId = null;

// Utilidades
const normalize = (s) =>
  (s ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const incluyeTexto = (c, texto) => {
  if (!texto) return true;
  const t = normalize(texto);
  return (
    normalize(c.nombre).includes(t) ||
    normalize(c.apellido).includes(t) ||
    normalize(c.telefono).includes(t) ||
    normalize(c.email).includes(t)
  );
};

const generarId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const iniciales = () => [
  { nombre: 'Juan', apellido: 'Pérez', telefono: '11-5555-1010', email: 'juan.perez@example.com' },
  { nombre: 'María', apellido: 'García', telefono: '11-5555-2020', email: 'maria.garcia@example.com' },
  { nombre: 'Carlos', apellido: 'Rodríguez', telefono: '11-5555-3030', email: 'c.rodriguez@example.com' },
  { nombre: 'Ana', apellido: 'López', telefono: '11-5555-4040', email: 'ana.lopez@example.com' },
  { nombre: 'Lucía', apellido: 'Martínez', telefono: '11-5555-5050', email: 'lucia.martinez@example.com' },
  { nombre: 'Pedro', apellido: 'Sánchez', telefono: '11-5555-6060', email: 'p.sanchez@example.com' },
  { nombre: 'Sofía', apellido: 'Gómez', telefono: '11-5555-7070', email: 'sofia.gomez@example.com' },
  { nombre: 'Diego', apellido: 'Díaz', telefono: '11-5555-8080', email: 'diego.diaz@example.com' },
  { nombre: 'Valentina', apellido: 'Fernández', telefono: '11-5555-9090', email: 'valen.fernandez@example.com' },
  { nombre: 'Mateo', apellido: 'Ruiz', telefono: '11-5555-0001', email: 'mateo.ruiz@example.com' },
].map((c) => ({ id: generarId(), ...c }));

const ordenar = (arr) =>
  [...arr].sort((a, b) => {
    const ap = normalize(a.apellido).localeCompare(normalize(b.apellido));
    if (ap !== 0) return ap;
    return normalize(a.nombre).localeCompare(normalize(b.nombre));
  });

// Generar HTML de tarjeta usando template literals
const crearCardHTML = (c) => {
  return `
    <article data-id="${c.id}">
      <header>
        <strong class="card-title">${c.nombre} ${c.apellido}</strong>
      </header>
      <p class="meta">
        <small class="card-phone">📞 ${c.telefono}</small>
        <small class="card-email">✉️ ${c.email}</small>
      </p>
      <div>
        <menu class="icon-row" style="margin:0;padding:0;list-style:none;">
          <button type="button" class="icon-btn secondary outline" data-action="edit" aria-label="Editar contacto ${c.nombre} ${c.apellido}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e21818" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil">
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          <button type="button" class="icon-btn secondary outline" data-action="delete" aria-label="Borrar contacto ${c.nombre} ${c.apellido}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e21818" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser-icon lucide-eraser">
              <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/>
              <path d="m5.082 11.09 8.828 8.828"/>
            </svg>
          </button>
        </menu>
      </div>
    </article>
  `;
};

const render = () => {
  const filtro = $search.value || '';
  const filtrados = ordenar(agenda.listar()).filter((c) => incluyeTexto(c, filtro));
  
  $cards.setAttribute('aria-busy', 'true');
  
  if (filtrados.length === 0) {
    $empty.hidden = false;
    $cards.innerHTML = '';
  } else {
    $empty.hidden = true;
    // Generar HTML usando string interpolation
    const cardsHTML = filtrados.map(c => crearCardHTML(c)).join('');
    $cards.innerHTML = cardsHTML;
  }
  
  $cards.setAttribute('aria-busy', 'false');
};

// Eventos UI
$search?.addEventListener('input', () => render());
$addBtn?.addEventListener('click', () => abrirDialogoCrear());
$cancelBtn?.addEventListener('click', () => cerrarDialogo());

$form?.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const data = obtenerDatosFormulario();
  if (!data) return; // campos requeridos
  if (editandoId) {
    agenda.actualizar(editandoId, data);
  } else {
    agenda.agregar(data);
  }
  cerrarDialogo(); // Ocultar formulario después de guardar
  render();
});

$cards?.addEventListener('click', (ev) => {
  const t = ev.target;
  if (!(t instanceof Element)) return;
  const btn = t.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  if (!action) return;
  const article = btn.closest('article');
  if (!article) return;
  const id = article.dataset.id;
  if (!id) return;
  if (action === 'edit') {
    const c = agenda.buscarPorId(id);
    if (!c) return;
    abrirDialogoEditar(c);
  } else if (action === 'delete') {
    agenda.borrar(id); // borrado directo
    render();
  }
});

// Funciones para manejar el formulario (definido directamente en HTML)
function abrirDialogoCrear() {
  editandoId = null;
  $dialogTitle.textContent = 'Nuevo contacto';
  limpiarFormulario();
  $dialog.showModal(); // Mostrar formulario
  focusPrimerCampo();
}

function abrirDialogoEditar(c) {
  editandoId = c.id;
  $dialogTitle.textContent = 'Editar contacto';
  cargarFormulario(c); // Cargar datos del contacto
  $dialog.showModal(); // Mostrar formulario
  focusPrimerCampo();
}

function cerrarDialogo() {
  $dialog.close(); // Ocultar formulario
  limpiarFormulario();
  editandoId = null;
}

function limpiarFormulario() {
  $form.reset();
}

function cargarFormulario(data) {
  for (const key of FIELDS) {
    const el = $$(`[name="${key}"]`, $form);
    if (el) el.value = data?.[key] ?? '';
  }
}

function obtenerDatosFormulario() {
  const fd = new FormData($form);
  const data = {};
  for (const key of FIELDS) {
    const v = (fd.get(key) ?? '').toString().trim();
    if (!v) return null;
    data[key] = v;
  }
  return data;
}

function focusPrimerCampo() {
  const el = $$('input[name="nombre"]', $form) || $$('input,select,textarea', $form);
  setTimeout(() => el?.focus(), 0);
}

function init() {
  agenda = new Agenda(iniciales());
  // Asegurar que el formulario esté inicialmente oculto
  $dialog.close();
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

