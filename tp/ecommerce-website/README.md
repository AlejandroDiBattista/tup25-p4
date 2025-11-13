# E-commerce Website

This project is a simple e-commerce website built using React with Next.js for the frontend and FastAPI for the backend. It utilizes Tailwind CSS for styling and Shadcn UI for component design. The backend is powered by SQLModel and SQLite for data management.

## Project Structure

```
ecommerce-website
├── backend
│   ├── app
│   │   ├── api
│   │   │   ├── __init__.py
│   │   │   ├── endpoints
│   │   │   │   └── products.py
│   │   │   └── dependencies.py
│   │   ├── core
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models
│   │   │   └── product.py
│   │   ├── schemas
│   │   │   └── product.py
│   │   ├── main.py
│   │   └── __init__.py
│   ├── requirements.txt
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   └── Navbar.tsx
│   │   ├── pages
│   │   │   ├── _app.tsx
│   │   │   ├── index.tsx
│   │   │   └── api
│   │   │       └── products.ts
│   │   ├── styles
│   │   │   └── globals.css
│   │   └── utils
│   │       └── fetcher.ts
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm (for the frontend)
- Python 3.7+ and pip (for the backend)
- SQLite (for the database)

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000`.

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the FastAPI application:
   ```
   uvicorn app.main:app --reload
   ```

4. Open your browser and go to `http://localhost:8000/docs` to access the API documentation.

## Features

- User-friendly interface for browsing products.
- RESTful API for product management.
- Responsive design using Tailwind CSS.
- Modular components with Shadcn UI.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.