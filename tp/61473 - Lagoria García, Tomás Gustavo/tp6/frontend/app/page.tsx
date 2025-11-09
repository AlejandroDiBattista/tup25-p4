import { Header } from './components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Bienvenido a TP6 Shop
          </h1>
          <p className="text-xl text-gray-600">
            Tu tienda online de confianza
          </p>
          <div className="bg-white rounded-lg shadow p-8 mt-8">
            <p className="text-gray-700">
              🚀 Frontend en desarrollo - FASE 1 completada
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Autenticación implementada: Login, Registro y Header funcionando
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
