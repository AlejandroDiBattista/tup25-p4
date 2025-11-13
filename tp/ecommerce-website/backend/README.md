# E-commerce Website Backend

This is the backend for the e-commerce website, built using FastAPI, SQLModel, and SQLite. The backend provides a RESTful API for managing products and handling requests from the frontend.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py          # Initializes the API package
│   │   ├── endpoints/           # Contains API endpoint definitions
│   │   │   └── products.py      # API endpoints related to products
│   │   └── dependencies.py      # Dependency functions for the API
│   ├── core/
│   │   ├── config.py            # Configuration settings for the application
│   │   └── database.py          # Database connection and session management
│   ├── models/
│   │   └── product.py           # SQLModel schema for the Product entity
│   ├── schemas/
│   │   └── product.py           # Pydantic schemas for product data validation
│   ├── main.py                  # Entry point for the FastAPI application
│   └── __init__.py              # Initializes the app package
├── requirements.txt              # Lists dependencies for the backend
└── README.md                     # Documentation for the backend setup and usage
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-website/backend
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Access the API**
   The API will be available at `http://127.0.0.1:8000`. You can access the interactive API documentation at `http://127.0.0.1:8000/docs`.

## Features

- CRUD operations for products
- SQLite database for data persistence
- FastAPI for high performance and easy development

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.