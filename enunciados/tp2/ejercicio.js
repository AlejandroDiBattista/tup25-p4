class Contacto {
    constructor(id, nombre, apellido, telefono, email) {
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

    agregar(contacto) {
        contacto.id = ++this.ultimoId;
        this.contactos.push(contacto);
    }

    editar(id, nuevosDatos) {
        const contacto = this.contactos.find(c => c.id === id);
        if (contacto) Object.assign(contacto, nuevosDatos);
    }

    borrar(id) {
        this.contactos = this.contactos.filter(c => c.id !== id);
    }

    buscarPorTexto(texto) {
        const normalizar = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        texto = normalizar(texto);
        return this.contactos.filter(c =>
            normalizar(c.nombre).includes(texto) ||
            normalizar(c.apellido).includes(texto) ||
            normalizar(c.telefono).includes(texto) ||
            normalizar(c.email).includes(texto)
        );
    }

    listar() {
        return [...this.contactos].sort((a, b) => {
            const apA = a.apellido.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const apB = b.apellido.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            if (apA === apB) {
                const nomA = a.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const nomB = b.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                return nomA.localeCompare(nomB);
            }
            return apA.localeCompare(apB);
        });
    }
}

// Instancia y datos iniciales
const agenda = new Agenda();
const iniciales = [
    ["Diego", "Díaz", "11-5555-8080", "diego.diaz@example.com"],
    ["Valentina", "Fernández", "11-5555-9090", "valen.fernandez@example.com"],
    ["María", "García", "11-5555-2020", "maria.garcia@example.com"],
    ["Sofía", "Gómez", "11-5555-7070", "sofia.gomez@example.com"],
    ["Ana", "López", "11-5555-4040", "ana.lopez@example.com"],
    ["Lucía", "Martínez", "11-5555-5050", "lucia.martinez@example.com"],
    ["Juan", "Pérez", "11-5555-3030", "juan.perez@example.com"],
    ["Carlos", "Rodríguez", "11-5555-6060", "carlos.rodriguez@example.com"],
    ["Mateo", "Ruiz", "11-5555-1010", "mateo.ruiz@example.com"],
    ["Martina", "Suárez", "11-5555-2021", "martina.suarez@example.com"]
];
iniciales.forEach(([nombre, apellido, telefono, email]) =>
    agenda.agregar(new Contacto(null, nombre, apellido, telefono, email))
);

// Render cards
function renderContactos(lista, contactos) {
    lista.innerHTML = '';
    contactos.forEach(c => {
        const card = document.createElement('article');
        card.innerHTML = `
            <header><strong>${c.nombre} ${c.apellido}</strong></header>
            <p>📞 ${c.telefono}</p>
            <p>✉️ ${c.email}</p>
            <footer style="display:flex; gap:0.5rem;">
                <button class="editar" data-id="${c.id}" aria-label="Editar"><span>✏️</span></button>
                <button class="borrar" data-id="${c.id}" aria-label="Borrar"><span>🗑️</span></button>
            </footer>
        `;
        lista.appendChild(card);
    });
}

// --- EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('lista-contactos');
    const buscador = document.getElementById('buscador');
    const btnAgregar = document.getElementById('btnAgregar');
    const dialogo = document.getElementById('dialogoContacto');
    const form = document.getElementById('formContacto');
    const dialogoTitulo = document.getElementById('dialogoTitulo');
    const contactoId = document.getElementById('contactoId');
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');

    // Render inicial
    renderContactos(lista, agenda.listar());

    // Buscador
    buscador.addEventListener('input', () => {
        const texto = buscador.value;
        const filtrados = agenda.buscarPorTexto(texto);
        renderContactos(lista, filtrados);
    });

    // Agregar contacto
    btnAgregar.addEventListener('click', () => {
        dialogoTitulo.textContent = "Agregar contacto";
        contactoId.value = "";
        nombre.value = "";
        apellido.value = "";
        telefono.value = "";
        email.value = "";
        dialogo.showModal();
    });

    // Editar/Borrar
    lista.addEventListener('click', e => {
        if (e.target.closest('.borrar')) {
            const id = Number(e.target.closest('.borrar').dataset.id);
            agenda.borrar(id);
            renderContactos(lista, agenda.listar());
        }
        if (e.target.closest('.editar')) {
            const id = Number(e.target.closest('.editar').dataset.id);
            const c = agenda.contactos.find(c => c.id === id);
            if (c) {
                dialogoTitulo.textContent = "Editar contacto";
                contactoId.value = c.id;
                nombre.value = c.nombre;
                apellido.value = c.apellido;
                telefono.value = c.telefono;
                email.value = c.email;
                dialogo.showModal();
            }
        }
    });

    // Guardar contacto (alta/edición)
    form.addEventListener('submit', e => {
        e.preventDefault();
        const id = contactoId.value ? Number(contactoId.value) : null;
        if (id) {
            agenda.editar(id, {
                nombre: nombre.value,
                apellido: apellido.value,
                telefono: telefono.value,
                email: email.value
            });
        } else {
            agenda.agregar(new Contacto(null, nombre.value, apellido.value, telefono.value, email.value));
        }
        dialogo.close();
        renderContactos(lista, agenda.listar());
    });

    // Cancelar
    form.addEventListener('reset', e => {
        dialogo.close();
    });
});
