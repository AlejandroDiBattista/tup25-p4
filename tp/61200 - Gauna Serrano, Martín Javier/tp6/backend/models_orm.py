from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    carts = relationship("Cart", back_populates="user")
    purchases = relationship("Purchase", back_populates="user")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(Text)
    precio = Column(Float, nullable=False)
    categoria = Column(String, nullable=False)
    existencia = Column(Integer, nullable=False, default=0)
    imagen = Column(String)


class Cart(Base):
    __tablename__ = "carts"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    estado = Column(String, default="open")

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")
    user = relationship("User", back_populates="carts")


class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    cantidad = Column(Integer, nullable=False)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")


class Purchase(Base):
    __tablename__ = "purchases"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    direccion = Column(String, nullable=False)
    tarjeta = Column(String, nullable=False)
    total = Column(Float, nullable=False)
    envio = Column(Float, nullable=False)

    items = relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")
    user = relationship("User", back_populates="purchases")


class PurchaseItem(Base):
    __tablename__ = "purchase_items"
    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"), nullable=False)
    producto_id = Column(Integer, nullable=False)
    cantidad = Column(Integer, nullable=False)
    nombre = Column(String, nullable=False)
    precio_unitario = Column(Float, nullable=False)

    purchase = relationship("Purchase", back_populates="items")
