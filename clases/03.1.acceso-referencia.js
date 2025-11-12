
// Las constantes son variables que no pueden cambiar de referencia.
const aa = [1,2,3]

// Puede cambiar un valor interno del array
aa[1] = 1000

// Tambien puede cambiar su tamaño
aa.push(10)
console.log(aa)

// Pero no puede cambiar la referencia
// aa = [100, 200, 300] // Esto da error

// Lo mismo ocurre con los objetos
const b = {x: 10, y: 20}
const c = b // c y b apuntan al mismo objeto
c.y = 200
c.x = 100
console.log(b)
console.log(c)


// Podemos usar destructuring para asignar valores a variables
let x = 10, y = 20;

let e = {x, y} // Estructuramos un objeto con las variables x e y
console.log(e)

// Destructuring de arrays
let [primero, segundo, tercero, cuarto = 4] = [10, 20, 30] // Asignamos valores a las variables desde un array
console.log(primero, segundo, tercero, cuarto) // 10 20 30 4

// Destructuring de objetos
let f = {v: 100, w: 200}
let {v: v1, w: w1, z: z1 = 100} = {v: 100, w: 200, z:5} // Usa `v` para elegir y `v1` para asignar
console.log(v1, w1, z1)

// Operador rest `...`
// En arrays
let [p, q, ...resto] = [1, 2, 3, 4, 5, 6] // Resto toma todos los valores restantes en un array
console.log(p, q, resto) // 1 2 [3, 4, 5, 6]

// En objetos
let g = {a: 10, b: 20, c: 30}
let {a, ...r} = g 
console.log(a, r)

// Forma compacta
let h = {b: 20, c: 30, c: 1000, y: 30}

// Forma explicita
h = {}
h.b = 20
h.c = 30
h.c = 1000

console.log(h)

// Estructuras de datos recursivas
let j = {x: 10, y: 20}
j.j = j // OJO: Creo una propiedad `j` que apunta al mismo objeto (recursivo)
j.j.j.j.j.j.j.j = 999

console.log(j)

console.clear()
aa.nombre = "Juan"
aa[100] = "Cien"
for(let i=0; i < aa.length; i++) {
    let x = aa[i]
    x ?  console.log(x) : null
}


// operador ternario  a < b ? a : b
let l = 100, m = 200
let min 
if(l < m)
    min = l
else
    min = m

let max =  l > m ? l : m

console.clear()
for(let x in aa) {
    console.log(x, aa[x])
}

let xx = [
    {
        a: 10, 
        b:20
    },
    {
        a: [
            100,
            200,
            "300", 
            {   
                x: 10, 
                y: 20
            }
        ], 
        b:40
    }
]

