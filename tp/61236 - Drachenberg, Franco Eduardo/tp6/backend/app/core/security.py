from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import get_settings

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain_password: str) -> str:
    return password_context.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_context.verify(plain_password, hashed_password)

def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
    scopes: Optional[List[str]] = None,
) -> str:
    settings = get_settings()
    expire_delta = expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    expire_at = datetime.utcnow() + expire_delta

    to_encode: Dict[str, Any] = {"sub": subject, "exp": expire_at}
    if scopes:
        to_encode["scopes"] = scopes

    token = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return token

def decode_access_token(token: str) -> Dict[str, Any]:
    settings = get_settings()
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    return payload

__all__ = [
    "JWTError",
    "hash_password",
    "verify_password",
    "create_access_token",
    "decode_access_token",
]
