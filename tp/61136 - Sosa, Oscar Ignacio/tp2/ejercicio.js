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

  