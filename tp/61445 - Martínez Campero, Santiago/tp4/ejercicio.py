#TP4: Calculadora de prestamos - Sistema Francés

# Imprimir el título del programa
print("Calculadora de Amortización - Sistema Francés")

print("=== Ingresar datos del préstamo ===")
capital = float(input("Monto inicial del préstamo  :"))
tasa    = float(input("Tasa Nominal Anual (TNA)    :"))
cuotas  = int( input("Cantidad de cuotas mensuales:"))

tasa_periodica = tasa / 12
cuota_fija = capital * (tasa_periodica * (1 + tasa_periodica) ** cuotas) / ((1 + tasa_periodica) ** cuotas - 1)

tea = (1 + tasa_periodica) ** 12 - 1

print("=== Resultados ===")
print(f"Cuota fija (mensual)    : ${cuota_fija:.2f}")
print(f"Tasa periódica (TNA/12): {tasa_periodica*100:6.2f}%")
print(f"TEA (efectiva anual)   : {tea*100:6.2f}%")

print("\nCronograma de pagos:")
print("   Mes        Pago     Capital    Interés     Saldo   ")
print("---------- ---------- ---------- ---------- ----------")

amortizacion = []
saldo = capital
total_pago = 0
total_capital = 0
total_interes = 0


for mes in range(1, cuotas + 1):
    interes = saldo * tasa_periodica
    capital_amortizado = cuota_fija - interes
    saldo -= capital_amortizado
    amortizacion.append({
        'mes': mes,
        'pago': cuota_fija,
        'capital': capital_amortizado,
        'interes': interes,
        'saldo': saldo
    })

print("\nTotales:")
print(f"  Pago   : ${total_pago:,.2f}")
print(f"  Capital: ${total_capital:,.2f}")
print(f"  Interés: ${total_interes:,.2f}")
