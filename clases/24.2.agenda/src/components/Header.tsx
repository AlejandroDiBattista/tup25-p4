import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/listar" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors" >
              Home
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}