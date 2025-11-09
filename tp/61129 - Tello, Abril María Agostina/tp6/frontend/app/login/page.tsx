export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        <label className="block mb-2 text-sm font-medium">Correo</label>
        <input type="email" className="w-full mb-4 p-2 border rounded" placeholder="Correo" required />
        <label className="block mb-2 text-sm font-medium">Contraseña</label>
        <input type="password" className="w-full mb-6 p-2 border rounded" placeholder="Contraseña" required />
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded font-semibold">Entrar</button>
        <div className="mt-4 text-center text-sm">
          ¿No tienes cuenta? <a href="/register" className="text-blue-600">Regístrate</a>
        </div>
      </form>
    </div>
  );
}
