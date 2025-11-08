export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-12">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Copyright. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}