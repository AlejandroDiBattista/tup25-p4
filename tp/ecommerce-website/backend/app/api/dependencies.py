from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

def get_database_session() -> Session:
    db = get_db()
    try:
        yield db
    finally:
        db.close()