function* pares(){
    yield 2;
    yield 4;
    yield 6;
    yield 8;
    yield 10;
}

function* factoriales(n){
    let f = 1;
    for(let i = 1; i <= n; i++){
        f *= i;
        yield f;
    }
}

for(let f of factoriales(5)){
    console.log(f);
}

let lista = pares();
for(let x of lista){
    console.log(x);
}