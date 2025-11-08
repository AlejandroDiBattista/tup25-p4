class Arbol {
    #raiz
    #comparador
    
    constructor(comparador) {
        this.#raiz = {}
        this.#comparador = comparador ?? ((a, b) => a - b)
    }

    agregar(valor) {
        let actual = this.#raiz
        
        while (true) {
            if (!actual?.valor) {
                Object.assign(actual, { valor, menor: {}, mayor: {} })
                break
            } else {
                const comparacion = this.#comparador(valor, actual.valor)
                if (comparacion === 0) {
                    break  // El valor ya existe, no hacemos nada
                } else if (comparacion < 0) {
                    actual = actual.menor
                } else {
                    actual = actual.mayor
                }
            }
        }
        return this
    }

    buscar(valor) {
        let actual = this.#raiz
        while (actual?.valor) {
            const comparacion = this.#comparador(valor, actual.valor)
            if (comparacion === 0) {
                return true
            } else if (comparacion < 0) {
                actual = actual.menor
            } else {
                actual = actual.mayor
            }
        }
        return false
    }

    recorrerInOrden(accion) {
        function recorrer(raiz, nivel) {
            if (raiz?.valor) {
                recorrer(raiz.menor, nivel + 1)
                accion(raiz.valor, nivel)
                recorrer(raiz.mayor, nivel + 1)
            }
        }
        recorrer(this.#raiz, 1)
    }

    *[Symbol.iterator]() {
        function* recorrer(raiz) {
            if (raiz?.valor) {
                yield* recorrer(raiz.menor)
                yield raiz.valor
                yield* recorrer(raiz.mayor)
            }
        }
        yield* recorrer(this.#raiz)
    }
    *inOrden() {
        yield* this[Symbol.iterator]()  
    }
    *preOrden() {
        function* recorrer(raiz) {
            if (raiz?.valor) {
                yield raiz.valor
                yield* recorrer(raiz.menor)
                yield* recorrer(raiz.mayor)
            }
        }
        yield* recorrer(this.#raiz)
    }
    *postOrden() {
        function* recorrer(raiz) {
            if (raiz?.valor) {
                yield* recorrer(raiz.menor)
                yield* recorrer(raiz.mayor)
                yield raiz.valor
            }
        }
        yield* recorrer(this.#raiz)
    }
}

let a = new Arbol()

a.agregar(5).agregar(3).agregar(7).agregar(2).agregar(4).agregar(6).agregar(8).agregar(1)

console.log(a.buscar(4))                                    // true
console.log(a.buscar(9))                                    // false
console.log("Recorrido inOrden:")
a.recorrerInOrden((valor, nivel) => console.log(`${"  ".repeat(nivel - 1)}${valor}`))

for (let x of a) {
    console.log(x)                                          // 1, 2, 3, 4, 5, 6, 7, 8
}
console.log([...a])                                         // [1, 2, 3, 4, 5, 6, 7, 8]

console.log("> Recorrido inOrden:")
for (let x of a.inOrden()) {
    console.log(x)                                          // 1, 2, 3, 4, 5, 6, 7, 8
}

console.log("> Recorrido preOrden:")
for (let x of a.preOrden()) {
    console.log(x)                                          // 5, 3, 2, 1, 4, 7, 6, 8
}

console.log("> Recorrido postOrden:")
for (let x of a.postOrden()) {
    console.log(x)                                          // 1, 2, 4, 3, 6, 8, 7, 5
}