import { prompt, read, write } from "./io.js";

class Contacto {
  constructor(nombre, apellido, edad, telefono, email) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.telefono = telefono;
    this.email = email;
  }
}

class Agenda {
  constructor() {
    this.contactos = [];
  }
  agregar(contacto) {
    Agenda.cargar();
    this.contactos.push(contacto);
  }
  static async cargar() {
    const data = await read("./agenda.json");
    const agenda = new Agenda();
    agenda.contactos = JSON.parse(data);
    return agenda;
  }
  async guardar() {
    const data = this.contactos;
    await write(JSON.stringify(data, null, 2));
  }
}

// EJEMPLO DE USO... borrar...
let agenda = await Agenda.cargar();
console.log(agenda);
console.log("=== Ingresar nuevo contacto ===");

let c = new Contacto();
c.nombre = await prompt("Nombre :>");
c.edad = await prompt("Edad   :>");
agenda.agregar(c);

await agenda.guardar();
