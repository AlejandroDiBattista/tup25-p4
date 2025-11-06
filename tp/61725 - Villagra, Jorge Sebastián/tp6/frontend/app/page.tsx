import AuthGate from '@/app/auth/Gate/AuthGate';
import { obtenerProductos } from './services/productos';
import ProductosGrid from '@/components/ui/ProductosGrid';
import PageHeader from '@/components/ui/PageHeader';
import Navbar from '@/components/ui/Navbar';

export default async function HomePage() {
  const productos = await obtenerProductos();

  return (
    <>
      <Navbar />
      <AuthGate>
        <PageHeader title="Catálogo de Productos" subtitle={`${productos.length} productos disponibles`} />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <ProductosGrid productos={productos} />
        </main>
      </AuthGate>
    </>
  );
}
