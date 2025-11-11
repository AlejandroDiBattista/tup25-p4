from fastapi import FastAPI

app = FastAPI()

from .api import endpoints

app.include_router(endpoints.router)