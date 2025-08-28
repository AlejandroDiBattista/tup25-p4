import { prompt, read, write } from './io.js';

class Contacto {

    // Inicializar los atributos en el constructor
    constructor(nombre, apellido, edad, telefono, email) {
        this.id = null;
        this.apellido = apellido;
        this.nombre = nombre;
        this.edad = edad;
        this.telefono = telefono;
        this.email = email;
    }

}

class Agenda {

    static idAutoincrementable = 1;

    constructor() {
        this.contactos = []; // Array para almacenar los contactos
    }

    // Metodo para agregar un contacto a la agenda
    agregar(contacto) {
        contacto.id = Agenda.idAutoincrementable++;
        this.contactos.push(contacto);
    }


    editar(contactoViejo, contactoNuevo) {
        let indice = this.contactos.indexOf(contactoViejo);
        if (indice !== -1) {
            this.contactos[indice] = contactoNuevo;
            console.log("Contacto editado en la agenda.");
        } else {
            console.log("Contacto no encontrado.");
        }

    }

    // Metodo para eliminar un contacto de la agenda
    eliminar(contacto) {
        //Buscar el contacto en el array y eliminarlo
        let indice = this.contactos.indexOf(contacto);

        if (indice !== -1) {
            this.contactos.splice(indice, 1);
            console.log("Contacto eliminado de la agenda.");
        } else {
            console.log("Contacto no encontrado");
            return;
        }
    }

    listar() {

        console.log(" === LISTA DE CONTACTOS ===");

        //Ordenar contactos por Apellido, nombre  alfabéticamente con localeCompare

        this.contactos.sort((a, b) => {
            let apellidoComparacion = a.apellido.localeCompare(b.apellido);

            if (apellidoComparacion !== 0) {
                return apellidoComparacion;
            }

            return a.nombre.localeCompare(b.nombre);

        });

        console.table(this.contactos);

    }

    buscar(criterio) {

        let resultados =
            this.contactos.filter(c =>
                c.nombre.includes(criterio) ||
                c.apellido.includes(criterio) ||
                c.email.includes(criterio) ||
                c.telefono.includes(criterio)
            );


        console.log("Contactos encontrados:");
        resultados.forEach(c => console.log(c.toString()));

    }

    static async cargar() {
        // Crear una nueva agenda
        let agenda = new Agenda();

        // Cargar contactos desde el archivo JSON
        // Convertimos el texto JSON a un array de objetos Contacto
        agenda.contactos = JSON.parse(await read("./agenda.json"));

        if (agenda.contactos.length > 0) {
            // Actualizar idAutoincrementable
            let idMaximo = Math.max(...agenda.contactos.map(c => c.id));
            Agenda.idAutoincrementable = idMaximo + 1;
        }

        return agenda;
    }

    async guardar() {

        // Guardar contactos en el archivo JSON
        // agenda.json podemos enviarlo o no
        await write(JSON.stringify(this.contactos, null, 2), "./agenda.json");
    }


}



let agenda = await Agenda.cargar();
let contacto1 = new Contacto();



console.log("=== AGENDA DE CONTACTOS ===");

console.log(" Porfavor seleccione la operacion a realizar:");

console.log(" 1 - Agregar contacto");
console.log(" 2 - Editar contacto");
console.log(" 3 - Eliminar contacto");
console.log(" 4 - Listar contactos");
console.log(" 5 - Buscar contacto");
console.log(" 6 - Salir");

let opcion = await prompt("Ingrese una opcion (1-6): ");


switch (opcion) {

    case "1":

        contacto1.nombre = await prompt("Ingrese el nombre:      ");
        contacto1.apellido = await prompt("Ingrese el apellido:    ");
        contacto1.edad = await prompt("Ingrese la edad: ");
        contacto1.telefono = await prompt("Ingrese el telefono: ");
        contacto1.email = await prompt("Ingrese el email: ");

        agenda.agregar(contacto1);
        console.log("Contacto agregado a la agenda.");
        await agenda.guardar();
        break;

    case "2":
        // Objeto para almacenar los nuevos datos del contacto
        let contacto2 = {};

        let idBuscar = await prompt("Ingrese el ID del contacto a editar: ");
        contacto1 = agenda.contactos.find(c => c.id == idBuscar);

        if (!contacto1) {
            console.log("Contacto no encontrado.");
            break;
        }
        console.log("Ingrese los nuevos datos del contacto:");

        contacto2.id = contacto1.id; // Mantener el mismo ID
        contacto2.nombre = await prompt("Ingrese el nuevo nombre: ");
        contacto2.apellido = await prompt("Ingrese el nuevo apellido: ");
        contacto2.edad = await prompt("Ingrese la nueva edad: ");
        contacto2.telefono = await prompt("Ingrese el nuevo telefono: ");
        contacto2.email = await prompt("Ingrese el nuevo email: ");

        agenda.editar(contacto1, contacto2);
        await agenda.guardar();
        break;

    case "3":
        agenda.eliminar(contacto1);
        console.log("Contacto eliminado de la agenda.");
        await agenda.guardar();
        break;

    case "4":
        agenda.listar();
        break;

    case "5":
        let criterio = await prompt("Ingrese el criterio de búsqueda: ");
        agenda.buscar(criterio);

        console.log("Desea realizar otra operación? (s/n)");
        break;

    case "6":
        console.log("Saliendo...");
        break;

    default:
        console.log("Opción no válida.");
        break;
}


console.log("Gracias por usar la agenda de contactos.");


