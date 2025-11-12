import { ProductCard } from "./ProductCard";

const productos = [
  { id: 1, nombre: "Remera Oversize Negra", precio: 8500, imagen: "/ropa1.jpg" },
  { id: 2, nombre: "Buzo Beige Unisex", precio: 13500, imagen: "/ropa2.jpg" },
  { id: 3, nombre: "Pantalón Cargo Verde", precio: 16500, imagen: "/ropa3.jpg" },
  { id: 4, nombre: "Campera Denim", precio: 22000, imagen: "/ropa4.jpg" },
  { id: 5, nombre: "Zapatillas Urbanas", precio: 29000, imagen: "/ropa5.jpg" },
];

export function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  );
}