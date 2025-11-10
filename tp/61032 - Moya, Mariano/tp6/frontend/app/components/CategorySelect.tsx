import React from "react";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}

export default function CategorySelect({ value, onChange, categories }: CategorySelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">Todas las categorías</option>
      {categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
}
