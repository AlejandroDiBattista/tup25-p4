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
}

class Agenda {
  #contactos = [];
  #proximoId = 1;

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
    return nuevoContacto;
  }

  buscarPorId(id) {
    return this.#contactos.find((contacto) => contacto.id === id);
  }

  editar(id, nuevosDatos) {
    const contacto = this.buscarPorId(id);
    contacto?.actualizar(nuevosDatos);
    return !!contacto; // Truthy/Falsy Thinghy, No(No(undefined)) es false
  }

  borrar(id) {
    const index = this.#contactos.findIndex((contacto) => contacto.id === id);
    if (index !== -1) {
      this.#contactos.splice(index, 1);
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
