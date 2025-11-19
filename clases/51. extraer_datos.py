from pathlib import Path
import re 
import json


origen = Path("alumnos_temporal.md").resolve()
PATTERN_COMSION = r"## Comisión (\d)"
PATTERN_ALUMNO  = r"- (\d{5})  (.+?)\s{2,}([0-9()\s-]+)\s{2,}([🟢🔴]+)\s{2,}(\d+) (🟩|🟥|🟨)\s{2,}(\d+) (🟩|🟥|🟨)  (@\S+)"
PATTERN_ESTADO  = r"###\s+(Promociona|Recupera|Regulariza|Repite)"


def convertir_asistencia(texto: str) -> list[int]:
    resultado = []
    for char in texto:
        if char == "🟢":
            resultado.append(1)
        elif char == "🔴":
            resultado.append(0)
    return resultado


def convertir_resultado(texto: str) -> int:
    if texto == "🟩":
        return 2
    elif texto == "🟨":
        return 1
    elif texto == "🟥":
        return 0
    return -1


def leer_datos(origen: Path) -> list[dict]:
    salida = []
    with origen.open("r", encoding="utf-8") as f:
        for linea in f.readlines():
            if m := re.match(PATTERN_COMSION, linea):
                comision = m.group(1)
            elif m := re.match(PATTERN_ESTADO, linea):
                estado = m.group(1)
                # print(f"Comisión: {comision} | Estado: {estado}")
            elif m := re.match(PATTERN_ALUMNO, linea): #, re.UNICODE | re.IGNORECASE):
                legajo     = m.group(1)
                nombre     = m.group(2)
                telefono   = m.group(3)
                asistencia = convertir_asistencia(m.group(4))
                nota1      = int(m.group(5))
                resultado1 = convertir_resultado(m.group(6))
                nota2      = int(m.group(7))
                resultado2 = convertir_resultado(m.group(8))
                redes      = m.group(9)
                
                # print(f"Legajo: {legajo} | Nombre: {nombre} | Asistencia: {asistencia} | Puntos: {puntos} | Redes: {redes} | Comisión: {comision} | Estado: {estado}")        
                salida.append({
                    "legajo":     legajo,
                    "nombre":     nombre,
                    "telefono":   telefono,
                    "asistencia": asistencia,
                    "nota1":      nota1,
                    "resultado1": resultado1,
                    "nota2":      nota2,
                    "resultado2": resultado2,
                    "redes":      redes,
                    "comision":   comision,
                    "estado":     estado
                })
        return salida


def escribir_datos(destino: Path, datos: list[dict]):
    comisiones = set(map(lambda x: x["comision"], datos))
    estados    = set(map(lambda x: x["estado"], datos))
    with destino.open("w", encoding="utf-8") as f:  
        f.write("# Programación 4 | TUP 25\n")
        for c in comisiones:
            f.write(f"\n## Comisión {c}\n")
            for e in estados:
                f.write(f"\n### {e}\n\n")
                f.write("```text\n")
                for a in filter(lambda x: x["comision"] == c and x["estado"] == e, datos):
                    asistencia_str = ''.join(['🟢' if v == 1 else '🔴' for v in a['asistencia']])
                    resultado1_str = '🟩' if a['resultado1'] == 2 else '🟨' if a['resultado1'] == 1 else '🟥'
                    resultado2_str = '🟩' if a['resultado2'] == 2 else '🟨' if a['resultado2'] == 1 else '🟥'
                    f.write(f"- {a['legajo']}  {a['nombre']:40}  {a['telefono']}  {asistencia_str}  {a['nota1']:2} {resultado1_str}  {a['nota2']:2} {resultado2_str}  {a['redes']}\n")
                f.write("```\n")
                    
    
        
if __name__ == "__main__":
    datos = leer_datos(origen)
    # print(json.dumps(datos, indent=4, ensure_ascii=False))
    destino = Path("alumnos_procesado.md").resolve()
    escribir_datos(destino, datos)
    