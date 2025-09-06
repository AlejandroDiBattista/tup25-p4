'use strict';

const contenedorTarjetas = document.getElementById('cards');
const inputBusqueda = document.getElementById('buscar');
const botonAgregar = document.getElementById('btnAgregar');
const botonLogin = document.getElementById('btnLogin');

function normalizarTexto(texto){
  return (texto || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function obtenerContactosIniciales(){
  const base = [
    { nombre: 'Diego', apellido: 'Díaz', telefono: '11-5555-8080', email: 'diego.diaz@example.com' },
    { nombre: 'Valentina', apellido: 'Fernández', telefono: '11-5555-9090', email: 'valen.fernandez@example.com' },
    { nombre: 'María', apellido: 'García', telefono: '11-5555-2020', email: 'maria.garcia@example.com' },
    { nombre: 'Sofía', apellido: 'Gómez', telefono: '11-5555-7070', email: 'sofia.gomez@example.com' },
    { nombre: 'Ana', apellido: 'López', telefono: '11-5555-4040', email: 'ana.lopez@example.com' },
    { nombre: 'Lucía', apellido: 'Martínez', telefono: '11-5555-5050', email: 'lucia.martinez@example.com' },
    { nombre: 'Juan', apellido: 'Pérez', telefono: '', email: '' },
    { nombre: 'Carlos', apellido: 'Rodríguez', telefono: '', email: '' },
    { nombre: 'Mateo', apellido: 'Ruiz', telefono: '', email: '' },
    { nombre: 'Tomás', apellido: 'Santos', telefono: '', email: '' }
  ];
  const generarId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  return base.map(c => ({ id: generarId(), ...c }));
}

function filtrarContactosPorTexto(listaContactos, texto){
  const termino = normalizarTexto(texto);
  const ordenados = [...listaContactos].sort((a,b)=>
    normalizarTexto(a.apellido).localeCompare(normalizarTexto(b.apellido)) ||
    normalizarTexto(a.nombre).localeCompare(normalizarTexto(b.nombre))
  );
  if(!termino) return ordenados;
  return ordenados.filter((contacto)=>{
    const todo = `${contacto.nombre} ${contacto.apellido} ${contacto.telefono} ${contacto.email}`;
    return normalizarTexto(todo).includes(termino);
  });
}

function renderizarContactos(lista){
  const html = lista.map((contacto)=> `
    <article class="card">
      <header style="display:flex;align-items:center;gap:.5rem;">
        <i data-lucide="contact"></i>
        <h3>${contacto.nombre} ${contacto.apellido}</h3>
      </header>
      <p>
        <span style="display:inline-flex;align-items:center;gap:.35rem;"><i data-lucide="phone"></i> ${contacto.telefono || '—'}</span><br>
        <span style="display:inline-flex;align-items:center;gap:.35rem;"><i data-lucide="mail"></i> ${contacto.email || '—'}</span>
      </p>
    </article>
  `).join('');
  contenedorTarjetas.innerHTML = html;
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

const estado = { contactos: obtenerContactosIniciales() };
renderizarContactos(estado.contactos);

inputBusqueda.addEventListener('input', () => {
  const filtrados = filtrarContactosPorTexto(estado.contactos, inputBusqueda.value);
  renderizarContactos(filtrados);
});

botonAgregar.addEventListener('click', () => {
  alert('Agregar contacto: lo implementamos en el siguiente paso.');
});

botonLogin?.addEventListener('click', () => {
  alert('Login no implementado (placeholder).');
});

