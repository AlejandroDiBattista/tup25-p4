import { prompt, read, write } from "./io.js";

class Contacto {
  static ultimoId = 0;

  constructor(nombre, apellido, edad, telefono, email) {
    this.id = ++Contacto.ultimoId;
    Contacto.ultimoId = this.id;
    this.nombre = nombre.toUpperCase();
    this.apellido = apellido.toUpperCase();
    this.edad = edad;
    this.telefono = telefono;
    this.email = email.toLowerCase();
  }
}

class Agenda {
  constructor() {
    this.contactos = [];
  }
  agregar(contacto) {
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
const agenda = await Agenda.cargar();
agenda.contactos.forEach((c) => {
  if (c.id > Contacto.ultimoId) {
    Contacto.ultimoId = c.id;
  }
});
let opcion;
do {
  console.clear();
  console.log("-------- MENU AGENDA --------");
  console.log("1. Agregar contacto");
  console.log("2. Listar contactos");
  console.log("3. Editar contacto");
  console.log("4. Buscar contacto");
  console.log("5. Eliminar contacto");
  console.log("6. Salir");
  opcion = await prompt("Seleccione una opción:> ");

  switch (opcion) {
    case "1":
      console.clear();
      console.log("=== Agregar contacto ===");
      console.log("");

      let contactoNuevo = new Contacto();
      contactoNuevo.id = Contacto.ultimoId + 1;
      contactoNuevo.nombre = await prompt("Nombre:> ");
      contactoNuevo.apellido = await prompt("Apellido:> ");
      contactoNuevo.edad = await prompt("Edad:> ");
      contactoNuevo.telefono = await prompt("Teléfono:> ");
      contactoNuevo.email = await prompt("Email:> ");
      agenda.agregar(contactoNuevo);

      try {
        await agenda.guardar();
        console.clear();
        console.log("-------------------------------");
        console.log("Contacto guardado correctamente");
        await prompt("Presione cualquier tecla para volver...");
      } catch (error) {
        console.clear();
        console.error("Error al guardar la agenda: ", error);
      }
      break;

    case "2":
      console.clear();
      console.log("=== Lista de contactos ===\n");

      const listaOrdenada = agenda.contactos.sort(
        (a, b) =>
          a.apellido.localeCompare(b.apellido) ||
          a.nombre.localeCompare(b.nombre)
      );

      console.log(
        "ID".padEnd(5) +
          "Nombre Completo".padEnd(25) +
          "Edad".padEnd(8) +
          "Teléfono".padEnd(15) +
          "Email"
      );

      listaOrdenada.forEach((c) => {
        const nombreCompleto = `${c.apellido}, ${c.nombre}`;
        console.log(
          String(c.id).padEnd(5) +
            nombreCompleto.padEnd(25) +
            String(c.edad).padEnd(8) +
            c.telefono.padEnd(15) +
            c.email
        );
      });
      await prompt("\nPresione cualquier tecla para volver...");
      break;

    case "3":
      console.clear();
      console.log("=== Editar contacto ===");
      const idEditar = await prompt("ID del contacto a editar:> ");
      const contactoEditar = agenda.contactos.find(
        (c) => c.id === parseInt(idEditar)
      );
      if (contactoEditar) {
        contactoEditar.apellido = await prompt("Nuevo Apellido:> ");
        contactoEditar.edad = await prompt("Nueva Edad:> ");
        contactoEditar.telefono = await prompt("Nuevo Teléfono:> ");
        contactoEditar.email = await prompt("Nuevo Email:> ");
        await agenda.guardar();
      } else {
        console.log("Contacto no encontrado");
      }
      break;
    case "4":
      console.log("=== Buscar contacto ===");
      const nombreBuscar = await prompt("Nombre del contacto a buscar :>");
      const contactoBuscar = agenda.contactos.find(
        (c) => c.nombre === nombreBuscar
      );
      console.log(contactoBuscar ? contactoBuscar : "Contacto no encontrado");
      break;
    case "5":
      console.clear();
      console.log("=== Eliminar contacto ===\n");

      const idEliminar = await prompt("ID del contacto a eliminar:> ");
      const idNum = parseInt(idEliminar);

      const contacto = agenda.contactos.find((c) => c.id === idNum);
      const nombreCompleto = `${contacto.apellido}, ${contacto.nombre}`;
      if (!contacto) {
        console.log("No se encontró un contacto con ese ID.");
        break;
      }

      console.log(
        "\nID".padEnd(5) +
          "Nombre Completo".padEnd(25) +
          "Edad".padEnd(8) +
          "Teléfono".padEnd(15) +
          "Email"
      );
      console.log(
        String(contacto.id).padEnd(5) +
          nombreCompleto.padEnd(25) +
          String(contacto.edad).padEnd(8) +
          contacto.telefono.padEnd(15) +
          contacto.email
      );
      console.log("\n¿Está seguro que desea eliminar?");
      const confirmacion = await prompt("Presione S/N:> ");

      if (confirmacion.toUpperCase() === "S") {
        agenda.contactos = agenda.contactos.filter((c) => c.id !== idNum);
        console.log("\nContacto eliminado");
      } else {
        console.log("\nEliminación cancelada");
      }
      await prompt("\nPresione cualquier tecla para volver...");
      await agenda.guardar();
      break;

    case "6":
      console.clear();
      console.log("=== Salir ===");
      break;

    default:
      console.log("Opción inválida");
  }
} while (opcion !== "6");
