'use client';

import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  mensaje: string;
  onClose: () => void;
  duracion?: number;
}

export default function Toast({ mensaje, onClose, duracion = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duracion);

    return () => clearTimeout(timer);
  }, [onClose, duracion]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
      <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
        <CheckCircle className="h-6 w-6 flex-shrink-0" />
        <p className="flex-1 font-medium">{mensaje}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
