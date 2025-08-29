
import {prompt, read, write} from './io.js';

function esperarCualquierTecla(mensaje = "Presione cualquier tecla para volver al menú...") {
    return new Promise(resolve => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdout.write(mensaje);
        process.stdin.once('data', () => {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdout.write('\n');
            resolve();
        });
    });
}

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
        this.proximoId = 1;
    }

    async cargarDesdeArchivo() {
        try {
            this.contactos = await read('./agenda.json');
            if (this.contactos.length > 0) {
                this.proximoId = Math.max(...this.contactos.map(c => c.id)) + 1;
            }
        } catch (e) {
            this.contactos = [];
            this.proximoId = 1;
        }
    }

    async guardarEnArchivo() {
        await write(this.contactos, './agenda.json');
    }

    async agregarcontacto() {
        console.log("\n==Agregar contacto==");
        const nombre = await prompt("Nombre: ");
        const apellido = await prompt("Apellido: ");
        const edad = parseInt(await prompt("Edad: "), 10);
        const telefono = await prompt("Teléfono: ");
        const email = await prompt("Email: ");
        const nuevoContacto = new Contacto(this.proximoId++, nombre, apellido, edad, telefono, email);
        this.contactos.push(nuevoContacto);

        await this.guardarEnArchivo();
        console.log("Contacto agregado exitosamente.\n");
    }

    async editarcontacto(id, nuevosDatos) {}
    async eliminarcontacto(id) {}
    async listarcontactos() {
        if (this.contactos.length === 0) {
            console.log("No hay contactos en la agenda.");
        } else {
            console.log("\n==Lista de contactos==");
            console.log("ID | Nombre | Apellido | Edad | Teléfono | Email");
            console.log("--------------------------------------------------");
            this.contactos.forEach(c => {
                console.log(`ID: ${c.id}, Nombre: ${c.nombre}, apellido: ${c.apellido}, Edad: ${c.edad}, Teléfono: ${c.telefono}, Email: ${c.email}`);
            });
        }
        await esperarCualquierTecla();
    }
    buscarcontacto(texto) {}
}

async function mostrarMenu(agenda) {
    console.log(`
    =====AGENDA DE CONTACTOS=====
    1. Agregar contacto
    2. Editar contacto
    3. Eliminar contacto
    4. Listar contactos
    5. Buscar contacto
    0. Salir
    `);
    const opcion = await prompt("Seleccione una opción: ");
    switch (opcion) {
        case '1':
            await agenda.agregarcontacto();
            break;
        case '2':
            console.log("Opcion: Editar contacto");
            break;
        case '3':
            console.log("Opcion: Eliminar contacto");
            break;
        case '4':
            await agenda.listarcontactos();
            break;
        case '5':
            console.log("Opcion: Buscar contacto");
            break;
        case '0':
            console.log("Saliendo...");
            return false;
        default:
            console.log("Opción inválida. Intente de nuevo.");
    }
    return true;
}

async function main() {
    const agenda = new Agenda();
    await agenda.cargarDesdeArchivo();
    let continuar = true;
    while (continuar) {
        continuar = await mostrarMenu(agenda);
    }
    await agenda.guardarEnArchivo();
    console.log("Agenda guardada. Hasta luego!");
}
main();
