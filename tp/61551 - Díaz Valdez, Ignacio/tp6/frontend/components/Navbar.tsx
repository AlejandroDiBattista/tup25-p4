export default function Navbar() {
  return (
    <nav className="w-full bg-gray-100 border-b px-4 py-2 flex gap-4 text-sm">
      <a href="/" className="font-semibold">Productos</a>
      <a href="/carrito">Carrito</a>
      <a href="/compras">Compras</a>
      <span className="ml-auto flex gap-3">
        <a href="/login">Login</a>
        <a href="/register">Registro</a>
      </span>
    </nav>
  );
}
