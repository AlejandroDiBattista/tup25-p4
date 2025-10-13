import { Search } from 'lucide-react'

export default function Topbar({ title = 'Alumnos Programación 4', searchValue, onSearchChange }) {
  return (
    <header className="topbar">
      <h1>{title}</h1>
      <div className="search-wrap">
        <Search size={18} className="search-icon" />
        <input
          className="search"
          type="text"
          placeholder="Buscar por nombre, teléfono o legajo"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
    </header>
  )
}
