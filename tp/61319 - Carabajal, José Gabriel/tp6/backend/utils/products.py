from pathlib import Path
import json
from typing import List, Dict, Any

def cargar_productos() -> List[Dict[str, Any]]:
    ruta_productos = Path(__file__).resolve().parent.parent / "productos.json"
    with ruta_productos.open("r", encoding="utf-8") as f:
        return json.load(f)
