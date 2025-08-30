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
// let agenda = await Agenda.cargar();
// console.log(agenda);
// console.log("=== Ingresar nuevo contacto ===");

// let c = new Contacto();
// c.nombre = await prompt("Nombre :>");
// c.edad = await prompt("Edad   :>");
// agenda.agregar(c);

// await agenda.guardar();

do {
    console.log("-------- MENU AGENDA --------");
    console.log("1. Agregar contacto");
    console.log("2. Listar contactos");
    console.log("3. Editar contacto");
    console.log("4. Buscar contacto");
    console.log("5. Eliminar contacto");
    console.log("6. Salir");
    const opcion = await prompt("Seleccione una opción:> ");
    const agenda = await Agenda.cargar();

    switch (opcion) {
        case "1":
            console.log("=== Agregar contacto ===");
            let contactoNuevo = new Contacto();
            contactoNuevo.nombre = await prompt("Nombre:> ");
            contactoNuevo.apellido = await prompt("Apellido:> ");
            contactoNuevo.edad = await prompt("Edad:> ");
            contactoNuevo.telefono = await prompt("Teléfono:> ");
            contactoNuevo.email = await prompt("Email:> ");
            agenda.agregar(contactoNuevo);
            await agenda.guardar();
            break;
        case "2":
            console.log("=== Listar contactos ===");
            console.log(agenda.contactos);            
            break;
        case "3":
            console.log("=== Buscar contacto ===");
            const nombre = await prompt("Nombre del contacto a buscar :>");
            const contacto = agenda.contactos.find(c => c.nombre === nombre);
            console.log(contacto ? contacto : "Contacto no encontrado");
            break;
        case "4":
            console.log("=== Eliminar contacto ===");
            const nombreEliminar = await prompt("Nombre del contacto a eliminar :>");
            agenda.contactos = agenda.contactos.filter(c => c.nombre !== nombreEliminar);
            await agenda.guardar();
            break;
        case "5":
            console.log("Saliendo...");
            break;
        default:
            console.log("Opción inválida");
    }

} while (opcion !== "6");
