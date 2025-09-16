class Agenda{
    #contactos = [];

    agregar(nombre, telefono){
        this.#contactos
            .push({ nombre, telefono });
        return this
    }

    buscar(nombre){
        return this.#contactos
            .find(c => c.nombre === nombre);
    }

    get contactos(){
        return this.#contactos;
    }

    listar(f){
        for(let c of this.#contactos){
            f(c);
        }
    }

    *listar(){
        for(let c of this.#contactos){
            yield c;
        }
    }
    
    *listarOrdenadoPorTelefono(){
        let cmp = (a, b) => a.telefono.localeCompare(b.telefono);
        for(let c of this.#contactos.sort(cmp)){
            yield c;
        }
    }
    *listarOrdenadoPorNombre(){
        let cmp = (a, b) => a.nombre.localeCompare(b.nombre);
        for(let c of this.#contactos.sort(cmp)){
            yield c;
        }
    }
}

let a = new Agenda()
    .agregar("Juan", "123456789")
    .agregar("María", "987654321")
    .agregar("Pedro", "555555555");

for(let x of a.listarOrdenadoPorTelefono()){
    console.log(x);
}

for(let x of a.listarOrdenadoPorNombre()){
    console.log(x);
}

function* pares(){
    yield 2;
    yield 4;
    yield 6;
    yield 8;
    yield 10;
}

let lista = pares();

for(let x of lista){
    console.log(x);
}