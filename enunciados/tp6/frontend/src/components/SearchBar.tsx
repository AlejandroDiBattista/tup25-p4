'use client';

import React from 'react';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export default function SearchBar({ query, onChange, onClear }: SearchBarProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar productos..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
      <button
        type="button"
        onClick={() => onChange('')}
        className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        Limpiar
      </button>
    </div>
  );
}
