"use client";

import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
import Navbar from './components/navbar';
import SearchBarWithCategory from './components/search';
import { CarritoRead, Producto } from './types';
import { useEffect, useState } from 'react';
import Carrito from './components/Carrito';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [CarritoData, setCarritoData] = useState<CarritoRead[]>([]);
  // const productos = await obtenerProductos();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const prods = await obtenerProductos();
        setProductos(prods);

      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }

    fetchProductos();
  }, []);


  const categoriaUnicas = ['ropa de hombre', 'joyeria', 'electronica', 'ropa de mujer'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <Navbar />
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchBarWithCategory
          categorias={categoriaUnicas}
          setProductos={setProductos}
        />
        <div className="grid grid-cols-4 gap-6 mt-6">

          <div className="col-span-4 lg:col-span-3">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          </div>

          <div className="col-span-4 lg:col-span-1">
            <Carrito
              CarritoData={CarritoData}
              setCarritoData={setCarritoData}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
