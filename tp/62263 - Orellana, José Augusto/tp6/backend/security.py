import hashlib
import os

def verificar_contrasenia(contrasenia_plana: str, contrasenia_hasheada: str) -> bool:
    """Verifica una contraseña hasheada (con salt)."""

    # El hash guardado es 'salt:hash'
    try:
        salt_hex, hash_almacenado_hex = contrasenia_hasheada.split(':')
        salt = bytes.fromhex(salt_hex)
    except (ValueError, TypeError):
        # Si el hash no tiene el formato 'salt:hash', falla seguro
        return False

    # Hasheamos la contraseña plana con el MISMO salt
    hash_nuevo = hashlib.pbkdf2_hmac(
        'sha256',
        contrasenia_plana.encode('utf-8'),
        salt,
        100000 # Iteraciones
    )

    # Comparamos los hashes de forma segura
    return hash_nuevo.hex() == hash_almacenado_hex

def obtener_hash_contrasenia(contrasenia: str) -> str:
    """Genera un hash con un 'salt' aleatorio."""

    # Generamos un 'salt' aleatorio de 16 bytes
    salt = os.urandom(16) 

    # Creamos el hash
    hash_calculado = hashlib.pbkdf2_hmac(
        'sha256',
        contrasenia.encode('utf-8'), # Convertimos a bytes
        salt,
        100000 # Iteraciones
    )

    # Devolvemos el salt y el hash, separados por ':'
    # Guardamos ambos en formato hex (texto legible)
    return f"{salt.hex()}:{hash_calculado.hex()}"