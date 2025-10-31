#!/bin/bash

# Script para iniciar el frontend

echo "🚀 Iniciando el frontend..."
echo ""

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Iniciar el servidor de desarrollo
echo "✅ Aplicación corriendo en http://localhost:3000"
echo ""
npm run dev
