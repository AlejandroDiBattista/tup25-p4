import React from "react";

export default function Topbar({ onSearch }) {
  return (
    <header>
      <h1>Alumnos Programación 4</h1>
      <input
        type="search"
        placeholder="Buscar por nombre, teléfono o legajo"
        onChange={(e) => onSearch(e.target.value)}
      />
    </header>
  );
}
