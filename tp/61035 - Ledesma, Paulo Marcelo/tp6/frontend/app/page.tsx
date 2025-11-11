import { Carrito } from "./components/Carrito";
import { ProductosList } from "./components/ProductoCard";

export default function HomePage() {
  return (
    <div className="flex w-full">
      <div className="flex-1">
        <ProductosList />
      </div>
      <Carrito />
    </div>
  );
}
