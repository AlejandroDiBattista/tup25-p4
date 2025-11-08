from passlib.context import CryptContext

# 1. Se crea el contexto de encriptación
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_contrasenia(contrasenia_plana: str, contrasenia_hasheada: str) -> bool:
    """
    Verifica si la contraseña plana coincide con la contraseña hasheada.
    """
    return pwd_context.verify(contrasenia_plana, contrasenia_hasheada)

def obtener_hash_contrasenia(contrasenia: str) -> str:
    """
    Hashea la contraseña usando el contexto de encriptación.
    """
    return pwd_context.hash(contrasenia)