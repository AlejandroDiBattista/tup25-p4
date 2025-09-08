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