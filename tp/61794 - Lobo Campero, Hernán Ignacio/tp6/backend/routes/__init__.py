# Routes module
from .autenticacion import router as auth_router
from .productos import router as productos_router

__all__ = ["auth_router", "productos_router"]
