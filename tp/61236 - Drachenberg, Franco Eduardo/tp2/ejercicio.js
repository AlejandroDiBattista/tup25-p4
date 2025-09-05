"use strict";

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarTelefono(telefono) {
  // Acepta números con espacios, guiones, paréntesis
  const regex = /^[\d\s\-\(\)\+]+$/;
  return regex.test(telefono) && telefono.replace(/\D/g, "").length >= 7;
}

function validarTextoNoVacio(texto) {
  return texto && texto.trim().length > 0;
}

class Contacto {
  #id;
  #nombre;
  #apellido;
  #telefono;
  #email;

  constructor(id, nombre, apellido, telefono, email) {
    this.#id = id;
    this.#nombre = nombre;
    this.#apellido = apellido;
    this.#telefono = telefono;
    this.#email = email;
  }

  get id() {
    return this.#id;
  }
  get nombre() {
    return this.#nombre;
  }
  get apellido() {
    return this.#apellido;
  }
  get telefono() {
    return this.#telefono;
  }
  get email() {
    return this.#email;
  }

  actualizar(datos) {
    this.#nombre = datos.nombre ?? this.#nombre;
    this.#apellido = datos.apellido ?? this.#apellido;
    this.#telefono = datos.telefono ?? this.#telefono;
    this.#email = datos.email ?? this.#email;
  }

  toJSON() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      apellido: this.#apellido,
      telefono: this.#telefono,
      email: this.#email,
    };
  }
}

class Agenda {
  #contactos = [];
  #proximoId = 1;

  constructor() {
    this.cargarDeLocalStorage();
  }

  guardarEnLocalStorage() {
    localStorage.setItem("agenda", JSON.stringify(this.#contactos));
    localStorage.setItem("proximoId", this.#proximoId);
  }

  cargarDeLocalStorage() {
    const contactosGuardados = localStorage.getItem("agenda");
    const proximoIdGuardado = localStorage.getItem("proximoId");
    if (contactosGuardados) {
      const contactosSimples = JSON.parse(contactosGuardados);
      this.#contactos = contactosSimples.map(
        (c) => new Contacto(c.id, c.nombre, c.apellido, c.telefono, c.email)
      );
      this.#proximoId = proximoIdGuardado
        ? Number(proximoIdGuardado)
        : this.#contactos.length
        ? Math.max(...this.#contactos.map((c) => c.id)) + 1
        : 1;
    }
  }

  agregar(nombre, apellido, telefono, email) {
    const nuevoContacto = new Contacto(
      this.#proximoId,
      nombre,
      apellido,
      telefono,
      email
    );
    this.#contactos.push(nuevoContacto);
    this.#proximoId++;
    this.guardarEnLocalStorage();
    return nuevoContacto;
  }

  buscarPorId(id) {
    return this.#contactos.find((contacto) => contacto.id === id);
  }

  editar(id, nuevosDatos) {
    const contacto = this.buscarPorId(id);
    if (contacto) {
      contacto.actualizar(nuevosDatos);
      this.guardarEnLocalStorage();
    }
    return !!contacto;
  }

  borrar(id) {
    const index = this.#contactos.findIndex((contacto) => contacto.id === id);
    if (index !== -1) {
      this.#contactos.splice(index, 1);
      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }

  listar() {
    return [...this.#contactos].sort((a, b) => {
      const apellidoComp = a.apellido.localeCompare(b.apellido);
      if (apellidoComp !== 0) return apellidoComp;
      return a.nombre.localeCompare(b.nombre);
    });
  }

  buscar(termino) {
    const busqueda = termino.toLowerCase();
    return this.#contactos.filter((c) => {
      const valores = [c.nombre, c.apellido, c.telefono, c.email];
      return JSON.stringify(valores).toLowerCase().includes(busqueda);
    });
  }
}

function datosTest() {
  const datos = [
    {
      nombre: "Juan",
      apellido: "Perez",
      telefono: "123456789",
      email: "juan.perez@example.com",
    },
    {
      nombre: "Maria",
      apellido: "Gomez",
      telefono: "987654321",
      email: "maria.gomez@example.com",
    },
    {
      nombre: "Carlos",
      apellido: "Rodriguez",
      telefono: "555555555",
      email: "carlos.rodriguez@example.com",
    },
    {
      nombre: "Ana",
      apellido: "Lopez",
      telefono: "111222333",
      email: "ana.lopez@example.com",
    },
    {
      nombre: "Pedro",
      apellido: "Martinez",
      telefono: "444555666",
      email: "pedro.martinez@example.com",
    },
    {
      nombre: "Laura",
      apellido: "Sanchez",
      telefono: "777888999",
      email: "laura.sanchez@example.com",
    },
    {
      nombre: "Javier",
      apellido: "Fernandez",
      telefono: "666555444",
      email: "javier.fernandez@example.com",
    },
    {
      nombre: "Sofia",
      apellido: "Diaz",
      telefono: "333222111",
      email: "sofia.diaz@example.com",
    },
    {
      nombre: "Martin",
      apellido: "Alvarez",
      telefono: "888999000",
      email: "martin.alvarez@example.com",
    },
    {
      nombre: "Lucia",
      apellido: "Moreno",
      telefono: "222333444",
      email: "lucia.moreno@example.com",
    },
  ];
  return datos;
}

function renderizarContactos(contactos) {
  const listaContactos = document.getElementById("lista-contactos");
  listaContactos.innerHTML = "";
  contactos.forEach((contacto) => {
    const article = document.createElement("article");
    article.dataset.id = contacto.id;
    article.innerHTML = `
      <header>
        <strong>${contacto.nombre} ${contacto.apellido}</strong>
      </header>
      <p>Teléfono: ${contacto.telefono}</p>
      <p>Email: ${contacto.email}</p>
      <footer>
        <button class="btn-editar">Editar</button>
        <button class="btn-borrar">Borrar</button>
      </footer>
    `;
    listaContactos.appendChild(article);
  });
}

function setErrorMessage(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = field.nextElementSibling;
  errorElement.innerText = message;
}

function clearErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((el) => (el.innerText = ""));
}

const btnAgregar = document.getElementById("btn-agregar");
const dialogoContacto = document.getElementById("dialogo-contacto");
const formContacto = document.getElementById("form-contacto");
const btnCancelar = document.getElementById("btn-cancelar");
const closeButton = dialogoContacto.querySelector('[rel="prev"]');

btnAgregar.addEventListener("click", () => {
  clearErrorMessages();
  formContacto.reset();
  delete formContacto.dataset.id;
  dialogoContacto.querySelector("strong").textContent = "Agregar Contacto";
  dialogoContacto.showModal();
});

btnCancelar.addEventListener("click", () => {
  dialogoContacto.close();
});

closeButton.addEventListener("click", () => {
  dialogoContacto.close();
});

formContacto.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrorMessages();
  let isValid = true;

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const telefono = document.getElementById("telefono").value;
  const email = document.getElementById("email").value;

  if (!validarTextoNoVacio(nombre)) {
    setErrorMessage("nombre", "Nombre is required.");
    isValid = false;
  }

  if (!validarTextoNoVacio(apellido)) {
    setErrorMessage("apellido", "Apellido is required.");
    isValid = false;
  }

  if (!validarTelefono(telefono)) {
    setErrorMessage("telefono", "Please enter a valid phone number.");
    isValid = false;
  }

  if (!validarEmail(email)) {
    setErrorMessage("email", "Please enter a valid email address.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const id = formContacto.dataset.id;

  if (id) {
    agenda.editar(Number(id), { nombre, apellido, telefono, email });
  } else {
    agenda.agregar(nombre, apellido, telefono, email);
  }

  delete formContacto.dataset.id;
  renderizarContactos(agenda.listar());
  dialogoContacto.close();
});

const listaContactos = document.getElementById("lista-contactos");

listaContactos.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-borrar")) {
    const article = event.target.closest("article");
    const id = Number(article.dataset.id);
    agenda.borrar(id);
    renderizarContactos(agenda.listar());
  }

  if (event.target.classList.contains("btn-editar")) {
    clearErrorMessages();
    const article = event.target.closest("article");
    const id = Number(article.dataset.id);
    const contacto = agenda.buscarPorId(id);
    if (contacto) {
      document.getElementById("nombre").value = contacto.nombre;
      document.getElementById("apellido").value = contacto.apellido;
      document.getElementById("telefono").value = contacto.telefono;
      document.getElementById("email").value = contacto.email;
      formContacto.dataset.id = contacto.id;
      dialogoContacto.querySelector("strong").textContent = "Editar Contacto";
      dialogoContacto.showModal();
    }
  }
});

const buscador = document.getElementById("buscador");

buscador.addEventListener("input", () => {
  const termino = buscador.value;
  if (termino.length > 0) {
    const resultados = agenda.buscar(termino);
    renderizarContactos(resultados);
  } else {
    renderizarContactos(agenda.listar());
  }
});

const agenda = new Agenda();
if (agenda.listar().length === 0) {
  const datosIniciales = datosTest();
  datosIniciales.forEach((dato) =>
    agenda.agregar(dato.nombre, dato.apellido, dato.telefono, dato.email)
  );
}
renderizarContactos(agenda.listar());
