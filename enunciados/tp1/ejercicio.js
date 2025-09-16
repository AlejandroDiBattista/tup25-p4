import {prompt, read, write} from './io.js';


class Contacto {
    constructor({id=null,nombre="",apellido="",edad=0,telefono="",email=""}={}){
   this.id = id;
   this.nombre = nombre;
   this.apellido = apellido;
   this.edad = edad;
   this.telefono = telefono;
   this.email = email;
    }
     toString() {
    const idStr = String(this.id ?? "").padStart(2, "0");
    const nombreCompleto = `${this.apellido}, ${this.nombre}`.padEnd(22);
    const edadStr = String(this.edad).padEnd(4);
    const tel = (this.telefono || "").padEnd(14);
    return `${idStr} ${nombreCompleto} ${edadStr} ${tel} ${this.email}`;
  }

  mostrarData(){
    console.log(`ID      : ${this.id}`);
    console.log(`Nombre  : ${this.nombre}`);
    console.log(`Apellido: ${this.apellido}`);
    console.log(`Edad    : ${this.edad}`);
    console.log(`Teléfono: ${this.telefono}`);
    console.log(`Email   : ${this.email}`);
  }
}

class Agenda {
    constructor(contactos=[],ultimoId=0){
        this.contactos = contactos;
        this.ultimoId = ultimoId;
    }
    agregar(contacto){
        this.ultimoId++;
        contacto.id = this.ultimoId;
        this.contactos.push(contacto);
    }
    editar(id, data) {
        const c = this.buscarPorId(id); 
        if (!c) return false;
        Object.assign(c, data);
        return true;
    }
     borrar(id) {
    const idx = this.contactos.findIndex(c => c.id == id); 
    if (idx >= 0) {
      this.contactos.splice(idx, 1); 
     
      this.contactos.forEach((c, i) => c.id = i + 1);
      this.ultimoId = this.contactos.length; // Actualiza el último ID usado
      return true;
    }
    return false;
  }

   listar() {
    return [...this.contactos].sort((a, b) => a.id - b.id);
  }

  buscar(texto) {
    texto = texto.toLowerCase();
    return this.contactos.filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.apellido.toLowerCase().includes(texto) ||
      c.email.toLowerCase().includes(texto) ||
      String(c.telefono).toLowerCase().includes(texto)
    );
  }

  buscarPorId(id) {
    return this.contactos.find(c => c.id == id);
  }

  async guardar() {
    const data = JSON.stringify(
        {ultimoId: this.ultimoId,contactos: this.contactos},
        null,2
    );
    await write(data);
}


    static async cargar() {
    try {
      const raw = await read();
      const data = JSON.parse(raw);
      const contactos = (data.contactos ?? []).map(c => new Contacto(c));
      return new Agenda(contactos, data.ultimoId ?? 0);
    } catch {
      return new Agenda();
    }

    }
}

    async function menu() {
    let agenda = await Agenda.cargar();
    while (true) {
        console.clear();
        console.log("╔══════════════════════════════════════╗");
        console.log("║      📒  AGENDA DE CONTACTOS         ║");
        console.log("╠══════════════════════════════════════║");
        console.log("║ 1️⃣  Listar contactos                 ║");
        console.log("║ 2️⃣  Agregar contacto                 ║");
        console.log("║ 3️⃣  Editar contacto                  ║");
        console.log("║ 4️⃣  Borrar contacto                  ║");
        console.log("║ 5️⃣  Buscar contacto por Contenido    ║");
        console.log("║ 0️⃣  Salir                            ║");
        console.log("╚══════════════════════════════════════╝");
        const opcion = await prompt("\nSeleccione una opción 👉 ");
        console.log("─────────────────────────────────────────────");
        switch (opcion) {
            case "1":
                console.log("\n== 📋 Lista de contactos ==");
                console.log("ID Nombre Completo        Edad  Teléfono        Email");
                console.log("-- ---------------------  ----  --------------  -------------------");
                agenda.listar().forEach(c => console.log(c.toString()));
                await prompt("\n🔵 Presione Enter para continuar...");
                break;

            case "2":
                console.log("\n== ➕ Agregar contacto ==");
                const c = new Contacto();
                c.nombre = await prompt("📝 Nombre    : ");
                c.apellido = await prompt("📝 Apellido  : ");
                c.edad = await prompt("🎂 Edad      : ");
                c.telefono = await prompt("📞 Teléfono  : ");
                c.email = await prompt("✉️  Email     : ");
                agenda.agregar(c);
                await agenda.guardar();
                console.log("✅ Contacto agregado correctamente.");
                await prompt("\n🔵 Presione Enter para continuar...");
                break;

            case "3":
                const idEdit = await prompt("✏️  ID a editar : ");
                const contacto = agenda.buscarPorId(idEdit);
                if (!contacto) {
                    console.log("❌ No encontrado");
                } else {
                    console.log("Editando:");
                    contacto.mostrarData();//sda
                    const nombre = await prompt(`Nuevo nombre (${contacto.nombre}): `);
                    const apellido = await prompt(`Nuevo apellido (${contacto.apellido}): `);
                    const edad = await prompt(`Nueva edad (${contacto.edad}): `);
                    const telefono = await prompt(`Nuevo teléfono (${contacto.telefono}): `);
                    const email = await prompt(`Nuevo email (${contacto.email}): `);
                    agenda.editar(idEdit, {
                        nombre: nombre || contacto.nombre,
                        apellido: apellido || contacto.apellido,
                        edad: edad || contacto.edad,
                        telefono: telefono || contacto.telefono,
                        email: email || contacto.email
                    });
                    await agenda.guardar();
                    console.log("✅ Contacto editado correctamente.");
                }
                await prompt("\n🔵 Presione Enter para continuar...");
                break;

            case "4":
                const idDel = await prompt("🗑️  ID a borrar : ");
                const borrado = agenda.buscarPorId(idDel);
                if (borrado) {
                    console.log("🗑️  Contacto a borrar:");
                    borrado.mostrarData(); //asd
                    const seguro = await prompt("¿Está seguro que desea borrar este contacto? (s/n): ");
                    if (seguro.trim().toLowerCase() === "s") {
                        agenda.borrar(idDel);
                        await agenda.guardar();
                        console.log("✅ Contacto borrado correctamente.");
                    } else {
                        console.log("❎ Operación cancelada.");
                    }
                } else {
                    console.log("❌ No encontrado");
                }
                await prompt("\n🔵 Presione Enter para continuar...");
                break;

            case "5":
                const textoBuscar = await prompt("🔎 Ingrese texto a buscar : ");
                const resultados = agenda.buscar(textoBuscar);
                if (resultados.length > 0) {
                    console.log("🔍 Resultados encontrados:");
                    resultados.forEach(c => {
                        c.mostrarData(); //asd
                        console.log("-----------------------------");
                    });
                } else {
                    console.log("❌ No se encontraron contactos.");
                }
                await prompt("\n🔵 Presione Enter para continuar...");
                break;

            case "0":
                console.log("👋 ¡Hasta luego!");
                return;

            default:
                console.log("❌ Opción inválida");
                await prompt("\n🔵 Presione Enter para continuar...");
        }
    }
}

await agenda.guardar(); 
menu();
