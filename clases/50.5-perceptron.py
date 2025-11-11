import random
import matplotlib.pyplot as plt

w0 = 1
w1 = 1
b  = 2

xs = [[0,0],
      [0,1],
      [1,0],
      [1,1]]
y = [1, 
     1, 
     1, 
     0]  # Salidas esperadas para AND

def evaluar(x):
    return w0 * x[0] + w1 * x[1] + b

def activacion(x):
    return 1 if x >= 0 else 0

def predecir(x):
    return activacion(evaluar(x))  

def buscar_solucion():
    for i in range(10_000_000):
        w0 += random.uniform(-2, 2)
        w1 += random.uniform(-2, 2)
        b  += random.uniform(-2, 2)

        for x_i, y_i in zip(xs, y):
            salida = predecir(x_i)
            if salida != y_i:
                break
        else:
            print(f"Se encontró una solución: (en {i} iteraciones)")
            for x_i, y_i in zip(xs, y):
                print(f"x: {x_i} = {y_i} <=> {predecir(x_i)}")
            break
    else:
        print("No se encontró una solución.")

print("== Finalizado")

errores = []
def aprender(epochs=1000):
    for epoch in range(epochs):
        for x_i, y_i in zip(xs, y):
            salida = predecir(x_i)
            error = y_i - salida
            ajuste = 0.01 * error
            global w0, w1, b
            w0 += ajuste * x_i[0]
            w1 += ajuste * x_i[1]
            b  += ajuste
        errores.append(error)
        if error == 0:
            print(f"Convergió en la época {epoch}")
            break

print("== Iniciando aprendizaje")
aprender()
print("== Aprendizaje finalizado")
for x_i, y_i in zip(xs, y):
    print(f"x: {x_i} = {y_i} <=> {predecir(x_i)}")

plt.plot(errores)
# Perceptrón simple para la función NAND
