
let cuenta = 0;

// Normalización de texto (quita acentos y pasa a minúsculas)
const normalize = (s) =>
    (s ?? "")
        .toString()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();

class Agenda {  
    static ultimoId = 0;

    constructor() {
        this.contactos = [];
    }
   
    actualizar(contacto) {
        console.log(`Llamada nr ${++cuenta}:`, contacto);
        // Asegurar que el id sea numérico para comparar correctamente
        if (contacto.id) contacto.id = +contacto.id;
        if (contacto.id) {
            const index = this.contactos.findIndex(c => c.id === contacto.id);
            if (index !== -1) {
                this.contactos[index] = contacto;
            }
        } else {
            contacto.id = ++Agenda.ultimoId;
            this.contactos.push(contacto);
        }
    }

    eliminar(id) {
        const index = this.contactos.findIndex(c => c.id === id);
        if (index !== -1) {
            this.contactos.splice(index, 1);
        }
    }

    traer(id){
        return this.contactos.find(c => c.id === id);
    }

    traerTodos(filtro = '') {
        const q = normalize(filtro);
        let lista = this.contactos.filter(c => c.includes(q));
        lista.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
        return lista;
    }
}

class Contacto {
    constructor({id, nombre, apellido, telefono, email}) {
        this.id = Number.isFinite(Number(id)) ? Number(id) : 0;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }

    get nombreCompleto() {
        return `${this.apellido} ${this.nombre}`;
    }

    includes(texto){
        const n = (s) => normalize(s);
        const q = n(texto);
        return [this.nombre, this.apellido, this.telefono, this.email]
            .map(n)
            .some(v => v.includes(q));
    }
}

let datos = [
    {nombre: "Gonzalez",    apellido: "Maria", telefono: "987654321", email: "maria.gonzalez@example.com"},
    {nombre: "Gonzalez",    apellido: "Maria", telefono: "987654321", email: "maria.gonzalez@example.com"},
    {nombre: "Perez",       apellido: "Juan", telefono: "456123789", email: "juan.perez@example.com"},
    {nombre: "Perez",       apellido: "Juan", telefono: "456123789", email: "juan.perez@example.com"},
    {nombre: "Lopez",       apellido: "Ana", telefono: "321654987", email: "ana.lopez@example.com"},
    {nombre: "Lopez",       apellido: "Ana", telefono: "321654987", email: "ana.lopez@example.com"},
    {nombre: "Lopez",       apellido: "Ana", telefono: "321654987", email: "ana.lopez@example.com"},
    {nombre: "Lopez",       apellido: "Ana", telefono: "321654987", email: "ana.lopez@example.com"},
    {nombre: "Lopez",       apellido: "Ana", telefono: "321654987", email: "ana.lopez@example.com"},
    {nombre: "Lopez",       apellido: "Ana", telefono: "321654987", email: "ana.lopez@example.com"},
    {nombre: "Lopez",       apellido: "Ana", telefono: "321654987", email: "ana.lopez@example.com"},
    {nombre: "Lopez",       apellido: "Ana", telefono: "321654987", email: "ana.lopez@example.com"},
    {nombre: "Di Battista", apellido: "Alejandro", telefono: "123456789", email: "alejandro.dibattista@example.com"},
    ];

let agenda = new Agenda();
for (let dato of datos) {
    let contacto = new Contacto(dato);
    agenda.actualizar(contacto);
}

console.log("> Contactos cargados:", agenda.traerTodos().length);