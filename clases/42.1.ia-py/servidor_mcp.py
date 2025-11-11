from fastmcp import FastMCP

mcp = FastMCP("My MCP Server")

@mcp.tool
def factorial(n: int) -> int:
    """Calcula el factorial de un número n"""
    
    print(f"Calculando factorial de {n}")
    if n < 0:
        raise ValueError("El número debe ser no negativo")
    if n == 0 or n == 1:
        return 1
    resultado = 1
    for i in range(2, n + 1):
        resultado *= i
    return resultado


@mcp.tool
def primos(n: int) -> list[int]:
    """ Genera una lista de números primos hasta n """
    print(f"Generando lista de primos hasta {n}")
    primos = []
    for num in range(2, n + 1):
        es_primo = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                es_primo = False
                break
        if es_primo:
            primos.append(num)
    return primos

# Ruta del archivo de memoria
MEMORIA_FILE = "memoria.md"

@mcp.tool
def leer_memoria() -> str:
    """Lee el contenido del archivo de memoria (memoria.md)"""
    try:
        with open(MEMORIA_FILE, 'r', encoding='utf-8') as f:
            contenido = f.read()
        print(f"Memoria leída: {len(contenido)} caracteres")
        return contenido
    except FileNotFoundError:
        return "El archivo de memoria está vacío o no existe aún."
    except Exception as e:
        return f"Error al leer la memoria: {str(e)}"


@mcp.tool
def escribir_memoria(contenido: str) -> str:
    """Escribe contenido en el archivo de memoria (memoria.md)"""
    try:
        with open(MEMORIA_FILE, 'w', encoding='utf-8') as f:
            f.write(contenido)
        print(f"Memoria escrita: {len(contenido)} caracteres")
        return f"Contenido guardado exitosamente ({len(contenido)} caracteres)"
    except Exception as e:
        return f"Error al escribir en la memoria: {str(e)}"


if __name__ == "__main__":
    # Para HTTP/SSE: especifica el transporte y puerto
    mcp.run(transport="http", port=8000)