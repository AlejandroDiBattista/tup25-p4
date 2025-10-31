# Características de Python 3.13+ Utilizadas

Este proyecto aprovecha las características modernas de Python 3.13 o superior.

## Mejoras Implementadas

### 1. **Union Types con `|` (PEP 604)**

**Antes (Python 3.9):**
```python
from typing import Optional, List
def get_contact(contact_id: int) -> Optional[Contact]:
    ...
```

**Ahora (Python 3.13):**
```python
def get_contact(contact_id: int) -> Contact | None:
    ...
```

### 2. **Built-in Generic Types**

**Antes:**
```python
from typing import List, Dict
phones: List[Phone] = []
data: Dict[str, str] = {}
```

**Ahora:**
```python
phones: list[Phone] = []
data: dict[str, str] = {}
```

### 3. **Annotated Types para Dependencias (PEP 593)**

**Antes:**
```python
def list_contacts(
    session: Session = Depends(get_session),
    search: Optional[str] = None
):
    ...
```

**Ahora:**
```python
from typing import Annotated

def list_contacts(
    session: Annotated[Session, Depends(get_session)],
    search: str | None = None,
) -> ContactList:
    ...
```

### 4. **Walrus Operator `:=` (PEP 572)**

```python
# Uso eficiente en condicionales
if search_term := (search or "").strip():
    like_value = f"%{search_term}%"
    query = query.where(...)
```

### 5. **Type Hints Mejorados**

**Generator types:**
```python
from collections.abc import Generator

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
```

### 6. **String Formatting con `!s` en f-strings**

```python
# Mejor manejo de excepciones
raise HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail=f"Error: {e!s}"  # Usa __str__() explícitamente
) from e
```

### 7. **Improved Error Messages**

Python 3.13 incluye:
- Mensajes de error más descriptivos
- Mejor traceback con contexto
- Sugerencias de corrección automática

### 8. **Performance Improvements**

- **15-20% más rápido** que Python 3.12
- Mejor manejo de memoria
- GIL optimizado (preparación para Python 3.14 sin GIL)

## Archivos Actualizados

### `models.py`
- ✅ `Optional[int]` → `int | None`
- ✅ `List[Phone]` → `list[Phone]`
- ✅ Sin imports de `typing`

### `schemas.py`
- ✅ `list[str]` en lugar de `List[str]`
- ✅ Union types nativos

### `database.py`
- ✅ Type hints explícitos con `-> None`
- ✅ `Generator` de `collections.abc`

### `main.py`
- ✅ `Annotated` para dependencias FastAPI
- ✅ Union types en parámetros opcionales
- ✅ Type hints en todos los endpoints
- ✅ `!s` en f-strings para excepciones

### `services.py`
- ✅ Walrus operator en búsquedas
- ✅ Union types en retornos
- ✅ Type hints modernos

## Ventajas

1. **Código más legible**: Menos imports, sintaxis más natural
2. **Mejor rendimiento**: Python 3.13 es significativamente más rápido
3. **Type checking mejorado**: Mypy y Pylance detectan más errores
4. **Preparado para el futuro**: Compatible con Python 3.14+
5. **Mejores mensajes de error**: Debugging más fácil

## Requisitos

Para usar este proyecto necesitas:

```bash
python --version
# Python 3.13.0 o superior
```

Si usas `pyenv`:
```bash
pyenv install 3.13.0
pyenv local 3.13.0
```

## Migración desde versiones anteriores

Si actualizas desde Python 3.9-3.12:

1. **Actualizar Python:**
   ```bash
   # macOS con Homebrew
   brew install python@3.13
   
   # O con pyenv
   pyenv install 3.13.0
   ```

2. **Recrear entorno virtual:**
   ```bash
   rm -rf venv
   python3.13 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Verificar compatibilidad:**
   ```bash
   python -m pytest  # Si tienes tests
   mypy .            # Type checking
   ```

## Referencias

- [Python 3.13 Release Notes](https://docs.python.org/3.13/whatsnew/3.13.html)
- [PEP 604 – Union Types](https://peps.python.org/pep-0604/)
- [PEP 593 – Annotated Types](https://peps.python.org/pep-0593/)
- [FastAPI with Python 3.13](https://fastapi.tiangolo.com/)
