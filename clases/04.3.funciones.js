

function suma(a,b=0){
    let s = 0
    for(let x of arguments) {
        s += x
    }
    return s
}

let r = suma(1)
console.log(r)

let s = suma
r = suma(1,2,3,4)

function divMod(a,b){
    let div = Math.floor(a/b)
    let mod = a % b
    return [div,mod]
}

let [d,m] = divMod(11,3) // [3,2]
console.log(d, m)

const [contador, setContador] = useState(0)

function useState(inicial=0){
    let valor = inicial
    function set(nuevoValor){
        valor = nuevoValor
    }
    return [valor, set]
}

let [x,setX] = useState(0)
let [y,setY] = useState(10)
setX(10)
console.log(x)


function contador(incremento=1){
    let cuenta = 0
    function incrementar(){
        cuenta += incremento
        return cuenta
    }
    return incrementar
}

let c1 = contador(1)
let c2 = contador(2)
c1() // cuenta = 1
c1() // cuenta = 2
c1() // cuenta = 3

function Persona(nombre, apellido){
    this.nombre   = nombre
    this.apellido = apellido
    this.edad = 18
    this.cumpleAño = cumpleAño
    this.nombreCompleto = nombreCompleto

    function cumpleAño() {
        return this.edad++;
    }

    function nombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }
}

let p1 = new Persona("Juan", "Perez")
let p2 = new Persona("Ana", "Lopez")

log(p1.nombreCompleto(), p2.nombreCompleto())

function Empleado(nombre, sueldo){
    this.nombre = nombre
    this.sueldo = sueldo

    this.aumentar = (incremento) => {
        if(incremento > 0) {
            this.sueldo += incremento;
            if(this.sueldo > 100000) {
                this.sueldo = 100000;
            }
        }

    }
    this.aguinaldo = () => this.sueldo * 0.5;
}

let e1 = new Empleado("Carlos", 50000);
let e2 = new Empleado("Laura", 60000);
e1.aumentar(5000);
log(e1.nombreCompleto(), e2.nombreCompleto());


let multiplicar = (a, b=1) => a * b;


function tabla(maximo, f){
    for(let i=1; i<=maximo; i++){
        console.log(`${i} = ${f(i)}`);
    }
}

let t2       = x => x * 2
let cuadrado = x => x ** 2
let cubo     = x => x ** 3
let t7       = x => x * 7
let mitad    = x => x / 2

// Funcion como sentencia
function triple(x){
    return x * 3;
}

// Funcion como expresion (funcion anonima)
let cuadruple = function(x) {
    return x * 4;
}

// Funcion como expresion (funcion lambda o flecha gorda)
let quintuple = (x) => {
    return x * 5;
}

// Cuando solo tiene una sentencia y es return se puede omitir las `{}` y el `return`
let sextuple = (x) => x * 6

// Cuando solo tiene un parametro se puedo omitir los `()`
let octuple  = x => x * 8


tabla(12, t2)
tabla(12, cubo)
tabla(10, x => x * 10)


function map(lista,f){
    let salida = []
    for(let x of lista) {
        let r = f(x)
        salida.push(r)
    }
    return salida
}
r = map([1,2,3,4,5], x => x ** 3)

[1,2,3,4,5].map(x => x ** 3)

function filter(lista,condicion){
    let salida = []
    for(let x of lista) {
        if(condicion(x)) {
            salida.push(x)
        }
    }
    return salida
}

filter([1,2,3,4,5], x => x % 2 === 0)
[1,2,3,4,5].filter(x => x > 3)
[1,2,3,4,5].forEach(x => console.log(x))