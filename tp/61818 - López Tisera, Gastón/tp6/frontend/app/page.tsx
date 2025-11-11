import ProductCard from "@/components/ProductCard";
import { fetchProductos } from "@/lib/products";

export default async function Home() {
  const productos = await fetchProductos();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Catálogo de productos
          </h1>
          <p className="text-sm text-slate-600">
            Explorá nuestra selección y encontrá las mejores ofertas.
          </p>
          <span className="text-xs font-medium text-slate-500">
            {productos.length} productos disponibles
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </section>
      </main>
    </div>
  );
}
