class Stack {
    #items = [];

    push(element) {
        this.#items[this.#items.length] = element;
        return this;
    }

    pop() {
        return this.#items.pop();
    }

    isEmpty() {
        return this.#items.length === 0;
    }

}

let s = new Stack();
s.push(10)
.push(20)
.push(30);

while(!s.isEmpty()){
    console.log(s.pop());
}

[1, 2, 3, 13, 20]
    .map(x => x * x)
    .filter(x => x > 4)
    .forEach(x => console.log(x));