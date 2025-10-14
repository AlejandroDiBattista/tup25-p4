#TP4: Calculadora de prestamos - Sistema Francés

print("Calculadora de Amortización - Sistema Francés")

capital = float(input("- Monto inicial: "))
tasa    = float(input("- TNA: "))
cuotas  = int( input("- Cantidad de cuotas: "))


print("=== Ingresar datos del préstamo ===")
capital = float(input("Monto inicial del préstamo  :"))
tasa    = float(input("Tasa Nominal Anual (TNA)    :"))
cuotas  = int( input("Cantidad de cuotas mensuales:"))

## === Realizar los calculos ===

# Calcular las cuotas mensuales y la tasa periódica
tasa_mensual = tasa / 12

if cuotas <= 0:
    raise ValueError("La cantidad de cuotas debe ser mayor que 0.")
if capital <= 0:
    raise ValueError("El monto del préstamo debe ser mayor que 0.")
if tasa_mensual == 0:
    cuota = capital / cuotas
else:
    factor = (1 + tasa_mensual) ** cuotas
    cuota = capital * (tasa_mensual * factor) / (factor - 1)

tea = (1 + tasa_mensual) ** 12 - 1

# Mostrar los resultados en el formato pedido
print("\n=== Resultados ===")
print(f"Cuota fija (mensual)    : ${cuota:,.2f}")
print(f"Tasa periódica (TNA/12): {tasa_mensual*100:7.2f}%")
print(f"TEA (efectiva anual)   : {tea*100:7.2f}%")

print("\nCronograma de pagos:")
# Encabezados con ancho fijo de 10 caracteres
print(f"{'Mes':>10} {'Pago':>10} {'Capital':>10} {'Interés':>10} {'Saldo':>10}")
print(" ".join(["-"*10]*5))

saldo = capital
pago_total = 0.0
capital_total = 0.0
interes_total = 0.0

for mes in range(1, cuotas + 1):
    interes = saldo * tasa_mensual
    amortizacion = cuota - interes

    # Ajuste en la última cuota para evitar residuo por redondeos
    if mes == cuotas:
        amortizacion = saldo
        interes = cuota - amortizacion

    saldo -= amortizacion
    # Evitar -0.00 por errores numéricos mínimos
    if abs(saldo) < 0.005:
        saldo = 0.0

    pago_total += cuota
    capital_total += amortizacion
    interes_total += interes

    # Imprimir fila con 2 decimales y ancho fijo 10
    print(f"{mes:10d} {cuota:10.2f} {amortizacion:10.2f} {interes:10.2f} {saldo:10.2f}")

print()  # línea en blanco antes de totales

print("Totales:")
print(f"  Pago   :  ${pago_total:,.2f}")
print(f"  Capital:  ${capital_total:,.2f}")
print(f"  Interés:  ${interes_total:,.2f}")
