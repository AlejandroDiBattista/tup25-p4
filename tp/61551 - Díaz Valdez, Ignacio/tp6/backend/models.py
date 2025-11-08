"""
Archivo mantenido solo para compatibilidad.

Nota: El paquete real de modelos vive en la carpeta `models/`.
No declares modelos aquí para evitar conflictos de import.
"""

# Re-export conveniente para código legado que haga `from models import Producto`
from models.productos import Producto  # noqa: F401
