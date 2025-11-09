import { obtenerProductos } from './services/productos';
import ProductCatalog from './components/ProductCatalog';

export default async function Home() {
  const productos = await obtenerProductos();

  return <ProductCatalog productos={productos} />;
}
