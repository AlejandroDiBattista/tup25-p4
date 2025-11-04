from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from enum import Enum

if TYPE_CHECKING:
    from .productos import Producto

class EstadoPedido(str, Enum):
    PENDIENTE = "pendiente"
    PROCESANDO = "procesando"
    ENVIADO = "enviado"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"

class Usuario(SQLModel, table=True):
    """Modelo de Usuario"""
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    apellido: str = Field(max_length=100)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str = Field(max_length=255)
    telefono: Optional[str] = Field(default=None, max_length=20)
    direccion: Optional[str] = Field(default=None, max_length=500)
    fecha_registro: datetime = Field(default_factory=datetime.now)
    activo: bool = Field(default=True)
    
    # Relaciones
    carrito: Optional["Carrito"] = Relationship(back_populates="usuario")
    pedidos: List["Pedido"] = Relationship(back_populates="usuario")

class UsuarioRegistro(SQLModel):
    """Modelo para registro de usuario"""
    nombre: str = Field(min_length=2, max_length=100)
    apellido: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=255)
    password: str = Field(min_length=6, max_length=50)
    telefono: Optional[str] = None
    direccion: Optional[str] = None

class UsuarioLogin(SQLModel):
    """Modelo para login de usuario"""
    email: str
    password: str

class UsuarioPublico(SQLModel):
    """Modelo público para respuestas de API"""
    id: int
    nombre: str
    apellido: str
    email: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    fecha_registro: datetime

class Token(SQLModel):
    """Modelo para tokens de autenticación"""
    access_token: str
    token_type: str = "bearer"

class Carrito(SQLModel, table=True):
    """Modelo de Carrito de compras"""
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", unique=True)
    fecha_creacion: datetime = Field(default_factory=datetime.now)
    fecha_actualizacion: datetime = Field(default_factory=datetime.now)
    
    # Relaciones
    usuario: Usuario = Relationship(back_populates="carrito")
    items: List["ItemCarrito"] = Relationship(back_populates="carrito", cascade_delete=True)

class ItemCarrito(SQLModel, table=True):
    """Modelo de Item en el carrito"""
    id: Optional[int] = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = Field(ge=1)
    precio_unitario: float = Field(ge=0)  # Precio al momento de agregar
    fecha_agregado: datetime = Field(default_factory=datetime.now)
    
    # Relaciones
    carrito: Carrito = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="items_carrito")

class ItemCarritoRequest(SQLModel):
    """Modelo para agregar items al carrito"""
    producto_id: int
    cantidad: int = Field(ge=1, le=99)

class CarritoPublico(SQLModel):
    """Modelo público del carrito"""
    id: int
    items: List["ItemCarritoPublico"]
    total: float
    cantidad_items: int

class ItemCarritoPublico(SQLModel):
    """Modelo público de item del carrito"""
    id: int
    producto_id: int
    producto_titulo: str
    producto_imagen: str
    cantidad: int
    precio_unitario: float
    subtotal: float

class Pedido(SQLModel, table=True):
    """Modelo de Pedido"""
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    fecha_pedido: datetime = Field(default_factory=datetime.now)
    estado: EstadoPedido = Field(default=EstadoPedido.PENDIENTE)
    total: float = Field(ge=0)
    
    # Información de entrega
    direccion_entrega: str = Field(max_length=500)
    telefono_contacto: str = Field(max_length=20)
    
    # Información de pago (en un caso real sería más seguro)
    numero_tarjeta_last4: str = Field(max_length=4)  # Solo últimos 4 dígitos
    titular_tarjeta: str = Field(max_length=100)
    
    fecha_entrega_estimada: Optional[datetime] = None
    notas: Optional[str] = Field(default=None, max_length=500)
    
    # Relaciones
    usuario: Usuario = Relationship(back_populates="pedidos")
    items: List["ItemPedido"] = Relationship(back_populates="pedido", cascade_delete=True)

class ItemPedido(SQLModel, table=True):
    """Modelo de Item en el pedido"""
    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = Field(ge=1)
    precio_unitario: float = Field(ge=0)
    subtotal: float = Field(ge=0)
    
    # Relaciones
    pedido: Pedido = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="items_pedido")

class CheckoutRequest(SQLModel):
    """Modelo para finalizar compra"""
    direccion_entrega: str = Field(min_length=10, max_length=500)
    telefono_contacto: str = Field(min_length=8, max_length=20)
    numero_tarjeta: str = Field(min_length=16, max_length=16)
    titular_tarjeta: str = Field(min_length=2, max_length=100)
    fecha_expiracion: str = Field(regex=r"^(0[1-9]|1[0-2])\/([0-9]{2})$")  # MM/YY
    codigo_seguridad: str = Field(min_length=3, max_length=4)

class PedidoPublico(SQLModel):
    """Modelo público del pedido"""
    id: int
    fecha_pedido: datetime
    estado: EstadoPedido
    total: float
    direccion_entrega: str
    telefono_contacto: str
    items: List["ItemPedidoPublico"]
    fecha_entrega_estimada: Optional[datetime] = None

class ItemPedidoPublico(SQLModel):
    """Modelo público de item del pedido"""
    id: int
    producto_id: int
    producto_titulo: str
    producto_imagen: str
    cantidad: int
    precio_unitario: float
    subtotal: float