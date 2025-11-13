# E-commerce Website

This project is a simple e-commerce website built using React with Next.js for the frontend and FastAPI for the backend. It utilizes Tailwind CSS for styling and Shadcn UI for UI components.

## Frontend

The frontend is developed using Next.js, a React framework that enables server-side rendering and static site generation. Tailwind CSS is used for styling, providing a utility-first approach to design.

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ecommerce-website/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

### Folder Structure

- `public/`: Contains static assets such as images and icons.
- `src/components/`: Contains reusable components like the Navbar.
- `src/pages/`: Contains the main pages of the application.
- `src/styles/`: Contains global CSS styles.
- `src/utils/`: Contains utility functions for API requests.

### Technologies Used

- **Next.js**: For building the frontend application.
- **React**: For building user interfaces.
- **Tailwind CSS**: For styling the application.
- **Shadcn UI**: For UI components.

## Backend

The backend is built using FastAPI, providing a RESTful API for managing products. It uses SQLModel and SQLite for database management.

### Getting Started

1. **Navigate to the backend directory:**
   ```bash
   cd ecommerce-website/backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI application:**
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8000/docs` to view the API documentation.

### Folder Structure

- `app/api/`: Contains the API endpoints and dependencies.
- `app/core/`: Contains configuration and database setup.
- `app/models/`: Contains the database models.
- `app/schemas/`: Contains Pydantic schemas for data validation.

### Technologies Used

- **FastAPI**: For building the backend API.
- **SQLModel**: For database interactions.
- **SQLite**: For the database.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.