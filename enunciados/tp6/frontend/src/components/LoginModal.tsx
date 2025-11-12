'use client';

import React from 'react';
import Link from 'next/link';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Debes iniciar sesión</h2>
          <p className="text-gray-600">Para agregar productos al carrito, necesitas tener una cuenta.</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-center"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
          >
            Crear cuenta
          </Link>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 font-semibold py-2"
        >
          Continuar viendo
        </button>
      </div>
    </div>
  );
}
