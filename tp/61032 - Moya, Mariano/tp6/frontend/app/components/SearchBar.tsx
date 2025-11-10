import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Buscar..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-2 border rounded mb-4"
    />
  );
}
