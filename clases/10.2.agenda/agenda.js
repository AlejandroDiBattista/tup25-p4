
// Implmentamos las clases Contacto y Agenda para gestion la capa de negocio

class Contacto {
    constructor({id, nombre, apellido, telefono, email}) {
        this.id       = Number(id || 0);
        this.nombre   = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email    = email;
    }

    get nombreCompleto() {
        return `${this.apellido} ${this.nombre}`;
    }

    includes(texto){
        texto = texto.toLowerCase();
        return this.nombre.toLowerCase().includes(texto) || 
               this.apellido.toLowerCase().includes(texto) || 
               this.telefono.toLowerCase().includes(texto) || 
               this.email.toLowerCase().includes(texto);
    }
}


class Agenda {
    constructor(){
        this.contactos = [];
        this.ultimoId = 0;
    }

    agregar(contacto){
        contacto.id = ++this.ultimoId;
        this.contactos.push(contacto);
    }

    actualizar(contacto){
        const index = this.contactos.findIndex(c => c.id === contacto.id);
        if(index !== -1){
            this.contactos[index] = contacto;
        }
    }

    borrar(id){
        const index = this.contactos.findIndex(c => c.id === id);
        if(index !== -1){
            this.contactos.splice(index, 1);
        }
    }
    
    traer(id){
        return this.contactos.find(c => c.id === id);
    }

    traerTodos(filtro = ''){
        let lista = this.contactos.filter(c => c.includes(filtro));
        lista.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
        return lista;
    }
}

let datos = [
    {nombre: "Alejandro", apellido: "Di Battista", telefono: "(381) 555-1234", email: "alejandro.dibattista@example.com"},
    {nombre: "Juan",      apellido: "Perez",       telefono: "(381) 555-1235", email: "juan.perez@example.com"},
    {nombre: "Maria",     apellido: "Gomez",       telefono: "(381) 555-1236", email: "maria.gomez@example.com"},
    {nombre: "Maira",     apellido: "Gomez",       telefono: "(381) 555-1237", email: "maira.gomez@example.com"},
    {nombre: "Daniel",    apellido: "Gonzalez",    telefono: "(381) 555-1238", email: "daniel.gonzalez@example.com"},
    {nombre: "Federico",  apellido: "Lopez",       telefono: "(381) 555-1239", email: "federico.lopez@example.com"},
];

// Carga los datos iniciales en la agenda
let agenda = new Agenda();
for(const d of datos){
    agenda.agregar(new Contacto(d));
}

// Solo para depurar
console.debug(agenda.traerTodos());
