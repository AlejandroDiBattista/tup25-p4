import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCardFixed'
import { fetchProductos, addToCart } from '../lib/api'

export default function Home(){
  const [productos, setProductos] = useState([])

  useEffect(()=>{ load() }, [])
  async function load(){
    const data = await fetchProductos()
    setProductos(data || [])
  }

  async function handleAdd(p){
    const token = localStorage.getItem('token')
    if(!token){ alert('Debes iniciar sesión'); window.location.href='/login'; return }
    await addToCart(p.id || p.producto_id || p.id)
    alert('Agregado al carrito')
  }

  return (
    <div>
      <Navbar />
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map(p=> <ProductCard key={p.id || p.producto_id} p={p} onAdd={handleAdd} />)}
        </div>
      </main>
    </div>
  )
}
