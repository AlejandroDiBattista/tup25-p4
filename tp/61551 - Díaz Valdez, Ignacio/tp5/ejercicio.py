import csv
from collections import defaultdict
from pathlib import Path

BASE = Path(__file__).parent
FILES = ["gaseosas.csv", "vinos.csv"]

def leer_csv(path):
    rows = []
    with open(path, encoding="utf-8") as f:
        rdr = csv.DictReader(f)
        for r in rdr:
            rows.append(r)
    return rows

def to_float(s):
    try:
        return float(s)
    except:
        return 0.0

def agregar_aggregados(rows):
    by_sucursal = defaultdict(lambda: {"ingreso":0.0, "costo":0.0, "cantidad":0})
    by_producto = defaultdict(lambda: {"ingreso":0.0, "costo":0.0, "cantidad":0})
    for r in rows:
        suc = r.get("sucursal","").strip()
        prod = r.get("producto","").strip()
        ingreso = to_float(r.get("ingreso",0))
        costo = to_float(r.get("costo",0))
        cantidad = int(float(r.get("cantidad",0))) if r.get("cantidad","")!="" else 0

        by_sucursal[suc]["ingreso"] += ingreso
        by_sucursal[suc]["costo"] += costo
        by_sucursal[suc]["cantidad"] += cantidad

        key = f"{prod}"
        by_producto[key]["ingreso"] += ingreso
        by_producto[key]["costo"] += costo
        by_producto[key]["cantidad"] += cantidad

    return by_sucursal, by_producto

def imprimir_resumen(by_sucursal, by_producto):
    print("\nResumen por sucursal")
    print(f"{'Sucursal':20s}{'Ingreso':15s}{'Costo':15s}{'Utilidad':15s}{'Cant':8s}")
    for s, v in sorted(by_sucursal.items()):
        util = v["ingreso"] - v["costo"]
        print(f"{s:20s}{v['ingreso']:15,.2f}{v['costo']:15,.2f}{util:15,.2f}{v['cantidad']:8d}")

    print("\nResumen por producto")
    print(f"{'Producto':20s}{'Ingreso':15s}{'Costo':15s}{'Utilidad':15s}{'Cant':8s}")
    for p, v in sorted(by_producto.items()):
        util = v["ingreso"] - v["costo"]
        print(f"{p:20s}{v['ingreso']:15,.2f}{v['costo']:15,.2f}{util:15,.2f}{v['cantidad']:8d}")

def guardar_resumen_csv(by_sucursal, outpath):
    with open(outpath, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["sucursal","ingreso","costo","utilidad","cantidad"])
        for s,v in sorted(by_sucursal.items()):
            w.writerow([s, f"{v['ingreso']:.2f}", f"{v['costo']:.2f}", f"{v['ingreso']-v['costo']:.2f}", v['cantidad']])

def main():
    todas = []
    for fname in FILES:
        p = BASE / fname
        if p.exists():
            print(f"Cargando {fname}...")
            todas.extend(leer_csv(p))
        else:
            print(f"No encontrado: {fname} (se ignora)")

    if not todas:
        print("No se cargaron datos. Colocar los CSV en la carpeta tp5.")
        return

    by_sucursal, by_producto = agregar_aggregados(todas)
    imprimir_resumen(by_sucursal, by_producto)

    out = BASE / "resumen_sucursales.csv"
    guardar_resumen_csv(by_sucursal, out)
    print(f"\nResumen por sucursal guardado en: {out}")

if __name__ == "__main__":
    main()