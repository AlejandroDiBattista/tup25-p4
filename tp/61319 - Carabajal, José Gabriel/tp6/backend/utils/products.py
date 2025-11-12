from pathlib import Path
import json
from typing import List, Dict, Any

# Rutas
ROOT = Path(__file__).resolve().parents[1]        # .../backend
PRODUCTOS_PATH = ROOT / "productos.json"
STOCK_PATH = ROOT / "stock.json"

# ------------------ Productos ------------------

def cargar_productos() -> List[Dict[str, Any]]:
    with PRODUCTOS_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)

# ------------------ Stock (mapa id -> cantidad) ------------------

def _save_stock_map(data: Dict[str, int]) -> None:
    STOCK_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2),
                          encoding="utf-8")

def _load_or_init_stock_map() -> Dict[str, int]:
    """
    Lee stock.json; si NO existe, lo crea a partir de 'existencia' de productos.json.
    """
    if not STOCK_PATH.exists():
        productos = cargar_productos()
        data = {str(p["id"]): int(p.get("existencia", 0)) for p in productos}
        _save_stock_map(data)
        return data
    return json.loads(STOCK_PATH.read_text(encoding="utf-8"))

def get_stock(producto_id: int) -> int:
    stock = _load_or_init_stock_map()
    return int(stock.get(str(producto_id), 0))

def restar_stock(producto_id: int, cantidad: int = 1) -> None:
    stock = _load_or_init_stock_map()
    pid = str(producto_id)
    stock[pid] = max(0, int(stock.get(pid, 0)) - int(cantidad))
    _save_stock_map(stock)

def reset_stock_map() -> None:
    """
    Resetea forzando el stock desde productos.json (útil si stock.json se corrompió).
    """
    productos = cargar_productos()
    data = {str(p["id"]): int(p.get("existencia", 0)) for p in productos}
    _save_stock_map(data)
