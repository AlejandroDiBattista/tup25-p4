export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
        <label className="block mb-2 text-sm font-medium">Nombre</label>
        <input type="text" className="w-full mb-4 p-2 border rounded" placeholder="Nombre" required />
        <label className="block mb-2 text-sm font-medium">Correo</label>
        <input type="email" className="w-full mb-4 p-2 border rounded" placeholder="Correo" required />
        <label className="block mb-2 text-sm font-medium">Contraseña</label>
        <input type="password" className="w-full mb-6 p-2 border rounded" placeholder="Contraseña" required />
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded font-semibold">Registrarme</button>
        <div className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta? <a href="/login" className="text-blue-600">Inicia sesión</a>
        </div>
      </form>
    </div>
  );
}
