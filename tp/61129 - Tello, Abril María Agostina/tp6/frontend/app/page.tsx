
"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { obtenerProductos } from './services/productos';
import NavBarClient from "./components/NavBarClient";

type Producto = {
  id: number;
  nombre?: string;
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  precio: number;
  existencia?: number;
  stock?: number;
  imagen?: string;
};


export default function Home() {
  const [mensajeCarrito, setMensajeCarrito] = useState<{ id: number, mensaje: string } | null>(null);
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [carrito, setCarrito] = useState<(Producto & { cantidad: number })[]>([]);
  const [productosStock, setProductosStock] = useState<Record<number, number>>({});
  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null);

  useEffect(() => {
    // Escuchar cambios en localStorage para cerrar sesión globalmente
    const syncUsuario = () => {
      const user = typeof window !== "undefined" ? localStorage.getItem("usuario") : null;
      if (user) {
        setUsuario(JSON.parse(user));
      } else {
        setUsuario(null);
      }
    };
    syncUsuario();
    window.addEventListener("storage", syncUsuario);

    // Recuperar carrito de localStorage al cargar la página
    if (typeof window !== "undefined") {
      const carritoGuardado = localStorage.getItem("carrito");
      if (carritoGuardado) {
        try {
          const carritoParseado = JSON.parse(carritoGuardado);
          if (Array.isArray(carritoParseado)) {
            setCarrito(carritoParseado);
          }
        } catch {}
      }
    }

    return () => window.removeEventListener("storage", syncUsuario);
  }, []);

  useEffect(() => {
    obtenerProductos().then((data: Producto[]) => {
      setProductos(data);
      setCategorias(Array.from(new Set(data.map((p: Producto) => p.categoria).filter((cat): cat is string => typeof cat === 'string'))));
      // Inicializar stock considerando el carrito guardado
      const stockMap: Record<number, number> = {};
      data.forEach((p: Producto) => {
        const stockOriginal = typeof p.existencia === 'number' ? p.existencia : (typeof p.stock === 'number' ? p.stock : 0);
        const cantidadEnCarrito = (carrito.find((item) => item.id === p.id)?.cantidad) ?? 0;
        stockMap[p.id] = stockOriginal - cantidadEnCarrito;
      });
      setProductosStock(stockMap);
    });
  }, [carrito]);

    const productosFiltrados = productos.filter((p: Producto) =>
      (categoriaFiltro ? p.categoria === categoriaFiltro : true) &&
      (busqueda ? (p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || p.titulo?.toLowerCase().includes(busqueda.toLowerCase())) : true)
    );


    function agregarAlCarrito(producto: Producto) {
      if (!usuario) {
        setMensajeCarrito({ id: producto.id, mensaje: "Debe iniciar sesión o registrarse para agregar productos al carrito." });
        return;
      }
      setCarrito((prev: (Producto & { cantidad: number })[]) => {
        const existe = prev.find((item) => item.id === producto.id);
        const stockOriginal = productos.find((p) => p.id === producto.id)?.existencia ?? productos.find((p) => p.id === producto.id)?.stock ?? 0;
        const cantidadEnCarrito = existe?.cantidad ?? 0;
        if (cantidadEnCarrito >= stockOriginal) return prev;
        let nuevoCarrito;
        if (existe) {
          nuevoCarrito = prev.map((p) => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p);
        } else {
          nuevoCarrito = [...prev, { ...producto, cantidad: 1 }];
        }
        // Actualizar productosStock para mostrar correctamente el disponible
        setProductosStock((s) => ({ ...s, [producto.id]: stockOriginal - (cantidadEnCarrito + 1) }));
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        setMensajeCarrito(null);
        return nuevoCarrito;
      });
    }

    function cambiarCantidad(id: number, delta: number) {
      setCarrito((prev: (Producto & { cantidad: number })[]) => {
        const nuevoCarrito = prev.map((item: Producto & { cantidad: number }) => {
          if (item.id === id) {
            const stockOriginal = productos.find((p: Producto) => p.id === id)?.existencia ?? productos.find((p: Producto) => p.id === id)?.stock ?? 0;
            const stockDisponible = productosStock[id] ?? stockOriginal;
            const nuevaCantidad = item.cantidad + delta;
            if (nuevaCantidad < 1 || nuevaCantidad > stockOriginal) return item;
            if (delta > 0 && stockDisponible <= 0) return item;
            if (delta > 0 && item.cantidad >= stockOriginal) return item;
            if (delta < 0 && item.cantidad <= 1) return item;
            setProductosStock((s: Record<number, number>) => ({ ...s, [id]: stockDisponible - delta }));
            return { ...item, cantidad: nuevaCantidad };
          }
          return item;
        });
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        return nuevoCarrito;
      });
    }

  // Calcular totales con IVA diferenciado
  const subtotal = carrito.reduce((acc: number, item: Producto & { cantidad: number }) => acc + item.precio * item.cantidad, 0);
  // IVA por producto: electrónicos 10%, resto 21%
  const ivaPorProducto = carrito.map((item: Producto & { cantidad: number }) => {
    const esElectronico = (item.categoria?.toLowerCase() === "electrónica" || item.categoria?.toLowerCase() === "electronica");
    const ivaTasa = esElectronico ? 0.10 : 0.21;
    return item.precio * item.cantidad * ivaTasa;
  });
  const iva = ivaPorProducto.reduce((acc, v) => acc + v, 0);
  // Envío gratis si subtotal + iva > 1000
  const envio = (carrito.length > 0 && (subtotal + iva) > 1000) ? 0 : (carrito.length > 0 ? 50 : 0);
  const total = subtotal + iva + envio;

    return (
      <div className="min-h-screen bg-gray-50">
        <NavBarClient />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex gap-4 mb-6">
                <input type="text" placeholder="Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-4 py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
                <select className="bg-white border border-gray-300 rounded-lg px-4 py-3 w-full max-w-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition" style={{ minWidth: '200px' }} value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat: string) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-6">
                {productosFiltrados.map((producto: Producto) => {
                  const stockOriginal = productos.find((p) => p.id === producto.id)?.existencia ?? productos.find((p) => p.id === producto.id)?.stock ?? 0;
                  const cantidadEnCarrito = carrito.find((item) => item.id === producto.id)?.cantidad ?? 0;
                  const stockDisponible = stockOriginal - cantidadEnCarrito;
                  return (
                    <div key={producto.id} className="bg-white rounded-lg shadow flex flex-row items-center p-4">
                      <img src={`http://localhost:8000/${producto.imagen}`} alt={producto.titulo} className="w-32 h-32 object-contain rounded mr-6 bg-gray-100" />
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-1">
                          {producto.nombre ? (
                            <span className="block text-gray-900">{producto.nombre}</span>
                          ) : null}
                          <span className="block text-gray-900">{producto.titulo}</span>
                        </h2>
                        <p className="text-gray-600 mb-2">{producto.descripcion}</p>
                        <div className="text-sm text-gray-500 mb-2">Categoría: {producto.categoria}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        <div className="text-2xl font-bold text-gray-800">${producto.precio.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Disponible: {stockDisponible}</div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-transparent hover:text-blue-600 border border-blue-600 transition active:scale-95 disabled:opacity-50" onClick={() => agregarAlCarrito(producto)} disabled={stockDisponible <= 0}>Agregar al carrito</button>
                        {mensajeCarrito && mensajeCarrito.id === producto.id && (
                          <div className="text-xs text-red-600 font-bold mt-2">{mensajeCarrito.mensaje}</div>
                        )}
                        {stockDisponible <= 0 && (
                          <div className="text-xs text-red-600 font-bold mt-2">Sin stock</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <aside className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 h-fit border border-gray-200" style={{ minWidth: '380px' }}>
              {!usuario ? (
                <div className="text-gray-600 text-center">Inicie sesión para ver y editar el carrito.</div>
              ) : carrito.length === 0 ? (
                <div className="text-gray-600 text-center">Su carrito está vacío.</div>
              ) : (
                <>
                  <div className="mb-4 flex flex-col gap-5">
                    {carrito.map((item: Producto & { cantidad: number }, idx: number) => {
                      const stockOriginal = productos.find((p: Producto) => p.id === item.id)?.existencia ?? productos.find((p: Producto) => p.id === item.id)?.stock ?? 0;
                      const stockDisponible = productosStock[item.id] ?? stockOriginal;
                      const esElectronico = (item.categoria?.toLowerCase() === "electrónica" || item.categoria?.toLowerCase() === "electronica");
                      const ivaTasa = esElectronico ? 0.10 : 0.21;
                      const ivaItem = item.precio * item.cantidad * ivaTasa;
                      return (
                        <div key={item.id} className="flex items-center gap-5 p-4 bg-gray-50 rounded-lg shadow border border-gray-200 relative">
                          <img src={`http://localhost:8000/${item.imagen}`} alt={item.titulo} className="w-16 h-16 object-contain rounded bg-white border border-gray-300" />
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="font-semibold text-gray-800 text-base">{item.nombre || item.titulo}</div>
                            <div className="text-xs text-gray-500">${item.precio.toFixed(2)} c/u</div>
                            <div className="text-xs text-gray-600 mt-1">Disponible: {stockDisponible}</div>
                            <div className="text-xs text-gray-500 mt-1">IVA ({esElectronico ? "10%" : "21%"}): ${ivaItem.toFixed(2)}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <button className="px-2 py-1 rounded bg-gray-200 text-gray-400 font-bold text-lg active:scale-95 disabled:opacity-50" onClick={() => cambiarCantidad(item.id, -1)} disabled={item.cantidad <= 1}>-</button>
                              <span className="px-3 font-bold text-lg">{item.cantidad}</span>
                              <button className="px-2 py-1 rounded bg-gray-200 text-gray-400 font-bold text-lg active:scale-95 disabled:opacity-50" onClick={() => cambiarCantidad(item.id, 1)} disabled={stockDisponible <= 0 || item.cantidad >= stockOriginal}>+</button>
                            </div>
                            <span className="text-lg font-bold text-black mt-2">${(item.precio * item.cantidad).toFixed(2)}</span>
                          </div>
                          <button className="absolute -top-3 -right-3 text-white bg-red-500 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white text-xl font-bold transition" title="Eliminar" onClick={() => {
                            setCarrito((prev: (Producto & { cantidad: number })[]) => prev.filter((p: Producto & { cantidad: number }) => p.id !== item.id));
                            setProductosStock((s: Record<number, number>) => ({ ...s, [item.id]: stockOriginal }));
                          }}>×</button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t pt-6 mt-6 text-base">
                    <div className="flex justify-between mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between mb-2"><span>IVA</span><span>${iva.toFixed(2)}</span></div>
                    <div className="flex justify-between mb-2"><span>Envío</span><span>${envio.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-xl mt-4"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    <div className="flex gap-4 mt-8">
                      <button
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold border border-gray-300 shadow hover:bg-gray-300 transition active:scale-95"
                        onClick={() => {
                          setCarrito([]);
                          // Restaurar stock de todos los productos del carrito
                          setProductosStock((s) => {
                            const nuevoStock = { ...s };
                            carrito.forEach(item => {
                              const stockOriginal = productos.find((p) => p.id === item.id)?.existencia ?? productos.find((p) => p.id === item.id)?.stock ?? 0;
                              nuevoStock[item.id] = stockOriginal;
                            });
                            return nuevoStock;
                          });
                        }}
                      >Cancelar</button>
                      <button
                        className="flex-1 bg-blue-700 text-white py-3 rounded-lg font-bold border border-blue-700 shadow hover:bg-blue-800 transition active:scale-95"
                        onClick={() => router.push("/checkout")}
                      >Continuar compra</button>
                    </div>
                  </div>
                </>
              )}
            </aside>
          </div>
        </main>
      </div>
    );
}
