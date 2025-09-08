'use strict';

// Clase Contacto para representar un contacto individual
class Contacto {
  constructor(nombre, apellido, telefono, email) {
    this.id = Date.now() + Math.random(); // ID único simple
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
  }

  // Método para obtener el nombre completo
  getNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  // Método para normalizar texto (remover acentos y convertir a minúsculas)
  static normalizarTexto(texto) {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  // Método para verificar si el contacto coincide con un término de búsqueda
  coincideConBusqueda(termino) {
    const terminoNormalizado = Contacto.normalizarTexto(termino);
    const campos = [
      this.nombre,
      this.apellido,
      this.telefono,
      this.email
    ];
    
    return campos.some(campo => 
      Contacto.normalizarTexto(campo).includes(terminoNormalizado)
    );
  }
}

// Clase Agenda para manejar la colección de contactos
class Agenda {
  constructor() {
    this.contactos = [];
    this.contactoEditando = null;
  }

  // Agregar un nuevo contacto
  agregarContacto(contacto) {
    this.contactos.push(contacto);
    this.ordenarContactos();
  }

  // Actualizar un contacto existente
  actualizarContacto(id, datosActualizados) {
    const indice = this.contactos.findIndex(contacto => contacto.id === id);
    if (indice !== -1) {
      this.contactos[indice] = { ...this.contactos[indice], ...datosActualizados };
      this.ordenarContactos();
      return true;
    }
    return false;
  }

  // Eliminar un contacto
  eliminarContacto(id) {
    const indice = this.contactos.findIndex(contacto => contacto.id === id);
    if (indice !== -1) {
      this.contactos.splice(indice, 1);
      return true;
    }
    return false;
  }

  // Obtener todos los contactos
  obtenerContactos() {
    return this.contactos;
  }

  // Buscar contactos por término
  buscarContactos(termino) {
    if (!termino.trim()) {
      return this.contactos;
    }
    return this.contactos.filter(contacto => 
      contacto.coincideConBusqueda(termino)
    );
  }

  // Ordenar contactos por apellido y luego por nombre
  ordenarContactos() {
    this.contactos.sort((a, b) => {
      const apellidoA = Contacto.normalizarTexto(a.apellido);
      const apellidoB = Contacto.normalizarTexto(b.apellido);
      
      if (apellidoA !== apellidoB) {
        return apellidoA.localeCompare(apellidoB);
      }
      
      const nombreA = Contacto.normalizarTexto(a.nombre);
      const nombreB = Contacto.normalizarTexto(b.nombre);
      return nombreA.localeCompare(nombreB);
    });
  }

  // Obtener un contacto por ID
  obtenerContactoPorId(id) {
    return this.contactos.find(contacto => contacto.id === id);
  }
}

// Clase principal de la aplicación
class AgendaApp {
  constructor() {
    console.log('Inicializando AgendaApp...');
    this.agenda = new Agenda();
    this.terminoBusqueda = '';
    this.initializeElements();
    this.attachEventListeners();
    this.cargarContactosEjemplo();
    this.renderizarContactos();
    console.log('AgendaApp inicializada completamente');
  }

  // Inicializar referencias a elementos del DOM
  initializeElements() {
    this.searchInput = document.getElementById('searchInput');
    this.addContactBtn = document.getElementById('addContactBtn');
    this.contactsList = document.getElementById('contactsList');
    this.contactDialog = document.getElementById('contactDialog');
    this.contactForm = document.getElementById('contactForm');
    this.dialogTitle = document.getElementById('dialogTitle');
    this.cancelBtn = document.getElementById('cancelBtn');
    this.saveBtn = document.getElementById('saveBtn');
    
    // Verificar que todos los elementos se encontraron
    const elementos = {
      searchInput: this.searchInput,
      addContactBtn: this.addContactBtn,
      contactsList: this.contactsList,
      contactDialog: this.contactDialog,
      contactForm: this.contactForm,
      dialogTitle: this.dialogTitle,
      cancelBtn: this.cancelBtn,
      saveBtn: this.saveBtn
    };
    
    console.log('Elementos encontrados:', elementos);
    
    // Verificar que todos los elementos existen
    for (const [nombre, elemento] of Object.entries(elementos)) {
      if (!elemento) {
        console.error(`Elemento no encontrado: ${nombre}`);
      }
    }
  }

  // Adjuntar event listeners
  attachEventListeners() {
    console.log('Adjuntando event listeners...');
    
    // Verificar que los elementos existen antes de adjuntar listeners
    if (!this.searchInput || !this.addContactBtn || !this.contactForm || !this.cancelBtn || !this.contactDialog) {
      console.error('Algunos elementos no se encontraron para adjuntar event listeners');
      return;
    }
    
    // Búsqueda en tiempo real
    this.searchInput.addEventListener('input', (e) => {
      console.log('Búsqueda:', e.target.value);
      this.terminoBusqueda = e.target.value;
      this.renderizarContactos();
    });

    // Botón agregar contacto
    this.addContactBtn.addEventListener('click', () => {
      console.log('Botón agregar clickeado');
      this.abrirDialogo();
    });

    // Botón cancelar
    this.cancelBtn.addEventListener('click', () => {
      this.cerrarDialogo();
    });

    // Envío del formulario
    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.guardarContacto();
    });

    // Cerrar diálogo al hacer clic fuera
    this.contactDialog.addEventListener('click', (e) => {
      if (e.target === this.contactDialog) {
        this.cerrarDialogo();
      }
    });
    
    console.log('Event listeners adjuntados correctamente');
  }

  // Cargar contactos de ejemplo
  cargarContactosEjemplo() {
    console.log('Cargando contactos de ejemplo...');
    const contactosEjemplo = [
      new Contacto('Ana', 'García', '555-0101', 'ana.garcia@email.com'),
      new Contacto('Carlos', 'López', '555-0102', 'carlos.lopez@email.com'),
      new Contacto('María', 'Rodríguez', '555-0103', 'maria.rodriguez@email.com'),
      new Contacto('José', 'Martínez', '555-0104', 'jose.martinez@email.com'),
      new Contacto('Laura', 'Fernández', '555-0105', 'laura.fernandez@email.com'),
      new Contacto('Pedro', 'González', '555-0106', 'pedro.gonzalez@email.com'),
      new Contacto('Carmen', 'Sánchez', '555-0107', 'carmen.sanchez@email.com'),
      new Contacto('Antonio', 'Pérez', '555-0108', 'antonio.perez@email.com'),
      new Contacto('Isabel', 'Gómez', '555-0109', 'isabel.gomez@email.com'),
      new Contacto('Francisco', 'Ruiz', '555-0110', 'francisco.ruiz@email.com')
    ];

    contactosEjemplo.forEach(contacto => {
      this.agenda.agregarContacto(contacto);
    });
    console.log('Contactos de ejemplo cargados:', this.agenda.contactos.length);
  }

  // Renderizar la lista de contactos
  renderizarContactos() {
    console.log('Renderizando contactos...');
    const contactosFiltrados = this.agenda.buscarContactos(this.terminoBusqueda);
    console.log('Contactos filtrados:', contactosFiltrados.length);
    
    if (!this.contactsList) {
      console.error('contactsList no encontrado');
      return;
    }
    
    if (contactosFiltrados.length === 0) {
      this.contactsList.innerHTML = this.crearEstadoVacio();
      return;
    }

    this.contactsList.innerHTML = contactosFiltrados
      .map(contacto => this.crearTarjetaContacto(contacto))
      .join('');
  }

  // Crear HTML para una tarjeta de contacto
  crearTarjetaContacto(contacto) {
    return `
      <div class="contact-card" data-id="${contacto.id}">
        <div class="contact-name">
          <span>${contacto.getNombreCompleto()}</span>
          <div class="contact-actions">
            <button class="action-btn edit-btn" onclick="app.editarContacto(${contacto.id})" title="Editar contacto">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button class="action-btn delete-btn" onclick="app.eliminarContacto(${contacto.id})" title="Eliminar contacto">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="contact-details">
          <div class="contact-detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>${contacto.telefono}</span>
          </div>
          <div class="contact-detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>${contacto.email}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Crear HTML para estado vacío
  crearEstadoVacio() {
    return `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3>No se encontraron contactos</h3>
        <p>${this.terminoBusqueda ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer contacto usando el botón de arriba'}</p>
      </div>
    `;
  }

  // Abrir diálogo para agregar/editar contacto
  abrirDialogo(contacto = null) {
    console.log('Abriendo diálogo...', contacto);
    this.agenda.contactoEditando = contacto;
    
    if (!this.contactDialog) {
      console.error('contactDialog no encontrado');
      return;
    }
    
    if (contacto) {
      this.dialogTitle.textContent = 'Editar Contacto';
      document.getElementById('firstName').value = contacto.nombre;
      document.getElementById('lastName').value = contacto.apellido;
      document.getElementById('phone').value = contacto.telefono;
      document.getElementById('email').value = contacto.email;
    } else {
      this.dialogTitle.textContent = 'Agregar Contacto';
      this.contactForm.reset();
    }
    
    console.log('Mostrando modal...');
    this.contactDialog.showModal();
  }

  // Cerrar diálogo
  cerrarDialogo() {
    if (this.contactDialog) {
      this.contactDialog.close();
    }
    this.agenda.contactoEditando = null;
    if (this.contactForm) {
      this.contactForm.reset();
    }
  }

  // Guardar contacto (crear o actualizar)
  guardarContacto() {
    const formData = new FormData(this.contactForm);
    const datosContacto = {
      nombre: formData.get('firstName').trim(),
      apellido: formData.get('lastName').trim(),
      telefono: formData.get('phone').trim(),
      email: formData.get('email').trim()
    };

    // Validación básica
    if (!datosContacto.nombre || !datosContacto.apellido || 
        !datosContacto.telefono || !datosContacto.email) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (this.agenda.contactoEditando) {
      // Actualizar contacto existente
      const exito = this.agenda.actualizarContacto(
        this.agenda.contactoEditando.id, 
        datosContacto
      );
      if (!exito) {
        alert('Error al actualizar el contacto.');
        return;
      }
    } else {
      // Crear nuevo contacto
      const nuevoContacto = new Contacto(
        datosContacto.nombre,
        datosContacto.apellido,
        datosContacto.telefono,
        datosContacto.email
      );
      this.agenda.agregarContacto(nuevoContacto);
    }

    this.cerrarDialogo();
    this.renderizarContactos();
  }

  // Editar contacto
  editarContacto(id) {
    const contacto = this.agenda.obtenerContactoPorId(id);
    if (contacto) {
      this.abrirDialogo(contacto);
    }
  }

  // Eliminar contacto
  eliminarContacto(id) {
    const contacto = this.agenda.obtenerContactoPorId(id);
    if (contacto) {
      const exito = this.agenda.eliminarContacto(id);
      if (exito) {
        this.renderizarContactos();
      } else {
        alert('Error al eliminar el contacto.');
      }
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, inicializando aplicación...');
  try {
    window.app = new AgendaApp();
    console.log('Aplicación inicializada:', window.app);
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
  }
});