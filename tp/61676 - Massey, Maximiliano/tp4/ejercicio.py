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

# Calculamos la tasa periódica mensual (TNA/12)
tasa_periodica = tasa / 12

# Calculamos la cuota fija mensual usando la fórmula del sistema francés
# Cuota = P * (i * (1 + i) ** n) / ((1 + i) ** n - 1)
if tasa_periodica > 0:
	cuota = capital * (tasa_periodica * (1 + tasa_periodica) ** cuotas) / ((1 + tasa_periodica) ** cuotas - 1)
else:
	cuota = capital / cuotas

# Calculamos la Tasa Efectiva Anual (TEA)
# TEA = (1 + i) ** 12 - 1
TEA = (1 + tasa_periodica) ** 12 - 1

# Mostramos los resultados principales
print("\n=== Resultados ===")
print(f"Cuota fija (mensual)    : ${cuota:,.2f}")
print(f"Tasa periódica (TNA/12):   {tasa_periodica*100:.2f}%")
print(f"TEA (efectiva anual)   :   {TEA*100:.2f}%\n")

# Calcular las cuotas mensuales y la tasa periódica
# Mostrar los resultados en el formato pedido

# === Generar la tabla de amortización ===
tabla = []  # Lista para guardar los datos de cada cuota
saldo = capital
pago_total = 0
capital_total = 0
interes_total = 0

for mes in range(1, cuotas + 1):
	interes = saldo * tasa_periodica
	if mes == cuotas:
		# Última cuota: ajustar capital amortizado y saldo para evitar decimales residuales
		capital_amortizado = saldo
		pago = capital_amortizado + interes
		saldo_restante = 0.0
	else:
		capital_amortizado = cuota - interes
		pago = cuota
		saldo_restante = saldo - capital_amortizado
	# Guardar los datos de la cuota
	tabla.append({
		'mes': mes,
		'pago': pago,
		'capital': capital_amortizado,
		'interes': interes,
		'saldo': saldo_restante
	})
	# Acumular totales
	pago_total += pago
	capital_total += capital_amortizado
	interes_total += interes
	saldo = saldo_restante

# === Imprimir la tabla de amortización ===
print("Cronograma de pagos:")
print(f"{'Mes':>10} {'Pago':>10} {'Capital':>10} {'Interés':>10} {'Saldo':>10}")
print(f"{'-'*10} {'-'*10} {'-'*10} {'-'*10} {'-'*10}")
for fila in tabla:
	print(f"{fila['mes']:10d} {fila['pago']:10.2f} {fila['capital']:10.2f} {fila['interes']:10.2f} {fila['saldo']:10.2f}")



# === Imprimir los totales ===
print("\nTotales:")
print(f"  Pago   : ${pago_total:,.2f}")
print(f"  Capital: ${capital_total:,.2f}")
print(f"  Interés: ${interes_total:,.2f}")
