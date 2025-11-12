class Arbol {
    #raiz = {}

    agregar(valor){
        function agregarAux(raiz, valor){
            if(!raiz.valor){
                raiz.valor = valor;
                raiz.izq = {}
                raiz.der = {}
            } else if(valor < raiz.valor){
                agregarAux(raiz.izq, valor)
            } else {
                agregarAux(raiz.der, valor)
            }
        }
        agregarAux(this.#raiz, valor)
    }

    *recorrer(){
        function* recorrerAux(raiz){
            if(!raiz.valor) return

            yield* recorrerAux(raiz.izq)
            yield raiz.valor
            yield* recorrerAux(raiz.der)
        }
        yield* recorrerAux(this.#raiz)
    }
    *[Symbol.iterator](){
        yield* this.recorrer()
    }
}


let a = new Arbol();
a.agregar(5)
a.agregar(3)
a.agregar(2)
a.agregar(4)
a.agregar(7)
a.agregar(6)

for(let c of a){
    console.log(c);
}

for(let l of "hola mundo 😃  "){
    console.log(l);
}