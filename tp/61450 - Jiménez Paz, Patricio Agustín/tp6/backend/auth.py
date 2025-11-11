from datetime import datetime, timedelta
from hashlib import sha256
from secrets import token_hex
from fastapi import Depends, HTTPException, status, Cookie
from sqlmodel import Session, select
from models import Usuario


def hash_password(password: str) -> str:
    return sha256(password.encode('utf-8')).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password


def generar_token() -> str:
    return token_hex(16)


def obtener_usuario_actual(token: str = Cookie(default=None)) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No hay sesión activa"
        )
    return {"token": token}
