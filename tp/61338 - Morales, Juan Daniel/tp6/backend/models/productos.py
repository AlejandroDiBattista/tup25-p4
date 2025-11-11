from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

from sqlmodel import Session, select

# ⬇️ Ajustá este import según dónde esté definido tu modelo:
# Si Producto está en backend/models/__init__.py:
from . import Producto
# Si está en otro módulo, por ejemplo backend/models/producto.py:
# from .producto import Producto


def seed_productos(session: Session, base_dir: Path, filename: str = "productos.json") -> int:
    """
    Carga productos desde productos.json SOLO si la tabla está vacía.
    Devuelve la cantidad insertada.
    """
    path = base_dir / filename
    if not path.exists():
        # No hay archivo, no hacemos nada
        return 0

    # ¿Ya hay al menos un producto?
    ya_hay = session.exec(select(Producto.id)).first()
    if ya_hay is not None:
        return 0

    # Leer JSON (espera una lista de objetos)
    try:
        data: Iterable[dict] = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        # Si el JSON está mal formado, no insertamos nada
        return 0

    inserted = 0
    for raw in data:
        # Acepta solo las claves de tu modelo. Ignora extras (p. ej. "imagen")
        p = Producto(
            nombre=str(raw.get("nombre", "")).strip(),
            descripcion=str(raw.get("descripcion", "")),
            precio=float(raw.get("precio", 0.0)),
            categoria=str(raw.get("categoria", "")).strip(),
            existencia=int(raw.get("existencia", 0)),
        )
        session.add(p)
        inserted += 1

    session.commit()
    return inserted
