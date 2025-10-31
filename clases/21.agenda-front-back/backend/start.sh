#!/bin/bash

# Script para iniciar el backend

echo "🚀 Iniciando el backend..."
echo ""

# Activar el entorno virtual
source venv/bin/activate

# Iniciar el servidor
echo "✅ Servidor corriendo en http://localhost:8000"
echo "📚 Documentación API en http://localhost:8000/docs"
echo ""
uvicorn main:app --reload
