"""DEPRECADO: No usar este módulo.

Existe un paquete `models/` que es la única fuente de verdad.
Importar este archivo provoca un error para evitar colisiones con el paquete.
"""

raise ImportError(
	"No uses backend/models.py. Usa el paquete 'models/' (from models import ...)."
)
