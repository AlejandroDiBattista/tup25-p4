const fs = require("fs");
const readline = require("readline-sync");

class Contacto {
  constructor(id, nombre, apellido, edad, telefono, email) {
    this.id = id;
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
    this.ultimoId = 0;
    this.cargarJSON();
  }

  agregarContacto(nombre, apellido, edad, telefono, email) {
    const nuevo = new Contacto(++this.ultimoId, nombre, apellido, edad, telefono, email);
    this.contactos.push(nuevo);
    this.ordenar();
    this.guardarJSON();
    console.log("✅ Contacto agregado con éxito!");
  }

  editarContacto(id, nuevosDatos) {
    const contacto = this.contactos.find(c => c.id === id);
    if (contacto) {
      Object.assign(contacto, nuevosDatos);
      this.ordenar();
      this.guardarJSON();
      console.log("✏️ Contacto editado.");
    } else {
      console.log("❌ Contacto no encontrado.");
    }
  }

  borrarContacto(id) {
    const index = this.contactos.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contactos.splice(index, 1);
      this.guardarJSON();
      console.log("🗑️ Contacto eliminado.");
    } else {
      console.log("❌ Contacto no encontrado.");
    }
  }

  listarContactos() {
    console.log("\n📋 Lista de contactos:");
    this.contactos.forEach(c => {
      console.log(`${c.id}. ${c.apellido}, ${c.nombre} - ${c.telefono} - ${c.email}`);
    });
  }

  buscarContacto(palabra) {
    const resultados = this.contactos.filter(c =>
      c.nombre.toLowerCase().includes(palabra.toLowerCase()) ||
      c.apellido.toLowerCase().includes(palabra.toLowerCase())
    );
    console.log("\n🔎 Resultados de la búsqueda:");
    resultados.forEach(c => {
      console.log(`${c.id}. ${c.apellido}, ${c.nombre} - ${c.telefono} - ${c.email}`);
    });
  }

  ordenar() {
    this.contactos.sort((a, b) => {
      if (a.apellido === b.apellido) {
        return a.nombre.localeCompare(b.nombre);
      }
      return a.apellido.localeCompare(b.apellido);
    });
  }

  guardarJSON() {
    fs.writeFileSync("agenda.json", JSON.stringify(this, null, 2));
  }

  cargarJSON() {
    if (fs.existsSync("agenda.json")) {
      const data = JSON.parse(fs.readFileSync("agenda.json"));
      this.contactos = data.contactos.map(c => new Contacto(c.id, c.nombre, c.apellido, c.edad, c.telefono, c.email));
      this.ultimoId = data.ultimoId;
    }
  }
}
//Menu
const agenda = new Agenda();
let opcion = "";

do {
  console.log("\n===== 📒 AGENDA DE CONTACTOS =====");
  console.log("1. Agregar contacto");
  console.log("2. Editar contacto");
  console.log("3. Borrar contacto");
  console.log("4. Listar contactos");
  console.log("5. Buscar contacto");
  console.log("0. Salir");
  opcion = readline.question("👉 Elija una opcion: ");

  switch (opcion) {
    case "1":
      const nombre = readline.question("Nombre: ");
      const apellido = readline.question("Apellido: ");
      const edad = readline.questionInt("Edad: ");
      const telefono = readline.question("Telefono: ");
      const email = readline.question("Email: ");
      agenda.agregarContacto(nombre, apellido, edad, telefono, email);
      break;

    case "2":
      const idEditar = readline.questionInt("ID del contacto a editar: ");
      const nuevoTelefono = readline.question("Nuevo telefono: ");
      const nuevoEmail = readline.question("Nuevo email: ");
      agenda.editarContacto(idEditar, { telefono: nuevoTelefono, email: nuevoEmail });
      break;

    case "3":
      const idBorrar = readline.questionInt("ID del contacto a borrar: ");
      agenda.borrarContacto(idBorrar);
      break;

    case "4":
      agenda.listarContactos();
      break;

    case "5":
      const palabra = readline.question("Ingrese nombre o apellido a buscar: ");
      agenda.buscarContacto(palabra);
      break;

    case "0":
      console.log("👋 Saliendo de la agenda...");
      break;

    default:
      console.log("❌ Opción inválida.");
  }
} while (opcion !== "0");
