from fastapi import APIRouter, HTTPException
from typing import List
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductRead
from app.core.database import get_session
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/products/", response_model=ProductRead)
def create_product(product: ProductCreate, db: Session = next(get_session())):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/products/", response_model=List[ProductRead])
def read_products(skip: int = 0, limit: int = 10, db: Session = next(get_session())):
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@router.get("/products/{product_id}", response_model=ProductRead)
def read_product(product_id: int, db: Session = next(get_session())):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product