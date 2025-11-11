# backend/app/api/__init__.py

from fastapi import APIRouter

router = APIRouter()

from .endpoints import products  # Importing the products endpoints to register them with the router.