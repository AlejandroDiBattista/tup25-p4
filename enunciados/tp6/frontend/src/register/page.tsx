export default function Register() {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Crear Cuenta</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Nombre completo" className="w-full border rounded-md p-2" />
        <input type="email" placeholder="Correo electrónico" className="w-full border rounded-md p-2" />
        <input type="password" placeholder="Contraseña" className="w-full border rounded-md p-2" />
        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
          Registrarse
        </button>
      </form>
    </div>
  );
}