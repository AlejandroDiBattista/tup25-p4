import random
import matplotlib.pyplot as plt

w0, w1, b = 0, 0, 0

X = [  
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
    ]

y = [   0, 
        0, 
        0, 
        1]  # Función AND


def perceptron(x1, x2):
    return 1 if (w0 * x1 + w1 * x2 + b) >= 0 else 0

def buscar_solucion_aleatoria(X, y):
    global w0, w1, b
    print("\n== Buscando solución aleatoria ==")
    for i in range(1_000_000):
        w0 = random.uniform(-2, 2)
        w1 = random.uniform(-2, 2)
        b  = random.uniform(-2, 2)

        y_p = [perceptron(x1, x2) for x1, x2 in X]
        if y_p == y:
            print(f">> {w0=:0.2f}, {w1=:0.2f}, {b=:0.2f} (en {i})")
            return


def buscar_solucion_exhaustiva(X, y):
    global w0, w1, b
    print("\n== Buscando solución exhaustiva ==")
    for w0 in range(-2, 3):
        for w1 in range(-2, 3):
            for b in range(-4, 5):

                y_p = [perceptron(x1, x2) for x1, x2 in X]
                if y_p == y:
                    print(f">> {w0=:0.2f}, {w1=:0.2f}, {b=:0.2f}")
                    return


def buscar_solucion_aprendizaje(X, y, ajuste=0.1, epochs=1000):
    global w0, w1, b
    w0 = random.uniform(-2, 2)
    w1 = random.uniform(-2, 2)
    b  = random.uniform(-2, 2)

    print("\n== Buscando solución por aprendizaje ==")
    for i in range(epochs):
        errores = 0
        for (x1, x2), yr in zip(X, y):
            yp = perceptron(x1, x2)

            error = yr - yp # cálculo del error
            w0 += error  * x1 * ajuste
            w1 += error  * x2 * ajuste
            b  += error  * ajuste
            errores += abs(error)
            
        if errores == 0:
            print(f">> {w0=:0.2f}, {w1=:0.2f}, {b=:0.2f} (en {i} epochs)")
            return

# buscar_solucion_aleatoria(X, y)
buscar_solucion_exhaustiva(X, y)
buscar_solucion_aprendizaje(X, y)
for x1, x2 in X:
    print(f"perceptron({x1}, {x2}) = {perceptron(x1, x2)}")