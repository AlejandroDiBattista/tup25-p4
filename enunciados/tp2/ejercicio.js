class Contacto {
    constructor(id,nombre,apellido, telefono, email) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
        this.id = id;
        this.apellido = apellido;
    }
}
class Agenda{
constructor(){
    this.Contactos = [];
}
//implementacion de metodos de clase 

 agregar(contacto) {
        this.contactos.push(contacto);
    }

    buscar(id) {
        return this.contactos.find(c => c.id === id);
    }

    editar(id, nuevosDatos) {
        const contacto = this.buscar(id);
        if (contacto) {
            Object.assign(contacto, nuevosDatos);
            return true;
        }
        return false;
    }

    borrar(id) {
        const index = this.contactos.findIndex(c => c.id === id);
        if (index !== -1) {
            this.contactos.splice(index, 1);
            return true;
        }
        return false;
    }

    listar() {
        return this.contactos;
    }
//agregar
//buscar
//editar
//borrar
//listar
}
module.exports = [Contacto,Agenda];