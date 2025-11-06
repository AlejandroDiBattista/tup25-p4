class Agenda {
    #contactos = []

    agregar(nombre, telefono) {
        let contacto = { nombre, telefono }
        this.#contactos.push(contacto);
        this.#contactos.sort((c1, c2) => c1.nombre.localeCompare(c2.nombre));
        return this
    }

    buscar(nombre) {
        return !!this.#contactos.find(c => c.nombre === nombre);
    }

    get contactos() {
        let salida = []
        for(let x  of this.#contactos){
            salida.push(x);
        }
        return salida;
    }

}

let a = new Agenda()
    .agregar("Juan", "123456789")
    .agregar("Maria", "987654321")
    .agregar("Pedro", "555555555")

    console.log(a.buscar("Maria"));
    console.log(a.buscar("Luis"));

// a.listar()
a.contactos.clear()

a.contactos.forEach(c => console.log(c.nombre));