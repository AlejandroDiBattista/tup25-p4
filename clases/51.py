import re 
PATRON_LEGAJO = r""".*(tp\s*[1-6]).*(\d{5})[\s-]*(\w+)"""

pr = "tp1 - 61400 - Juan"


m = re.match(PATRON_LEGAJO, pr)
print(m.group(0))
print(m.group(1))
print(m.group(2))
print(m.group(3))


PATRON_FECHA = r"""(\d{2})[-/](\d{2})[-/](\d{4})"""

# := 
# m = re.match(PATRON_FECHA, "23/12/2023")
if m := re.match(PATRON_FECHA, "23/12/2023"):
    print("Fecha válida")
    print(f"Dia : {m.group(1)}")
    print(f"Mes : {m.group(2)}")
    print(f"Año : {m.group(3)}")
    