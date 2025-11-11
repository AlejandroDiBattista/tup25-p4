from sqlmodel import SQLModel, create_engine, Session
from sqlmodel import select
import json
from pathlib import Path
from typing import Generator

DATABASE_URL = "sqlite:///./ecommerce.db"

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def init_db(load_products: bool = True):
    # Create database and tables
    SQLModel.metadata.create_all(engine)

    if load_products:
        # Try to load productos.json at repo root or same folder
        candidates = [Path("productos.json"), Path(__file__).parent.parent / "productos.json"]
        for p in candidates:
            if p.exists():
                try:
                    from core_models import Product
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    with Session(engine) as session:
                        for item in data:
                            # Only add if not exists (by nombre)
                            stmt = select(Product).where(Product.nombre == item.get("nombre"))
                            result = session.exec(stmt).first()
                            if result is None:
                                prod = Product(
                                    nombre=item.get("nombre", ""),
                                    descripcion=item.get("descripcion", ""),
                                    precio=float(item.get("precio", 0)),
                                    categoria=item.get("categoria", ""),
                                    existencia=int(item.get("existencia", 0)),
                                )
                                session.add(prod)
                        session.commit()
                    break
                except Exception:
                    # If products file malformed or models import fails, skip
                    break
