import { debounce } from '../utils/text.js';

const SearchBar = ({ totalAlumnos, alumnosFiltrados, onBusqueda }) => {
  const manejarBusqueda = debounce((termino) => {
    onBusqueda(termino);
  }, 300);

  return (
    <div style={{ marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Buscar por nombre, teléfono o legajo..."
        onChange={(e) => manejarBusqueda(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '12px 16px',
          fontSize: '16px',
          border: '2px solid #ddd',
          borderRadius: '25px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = '#0066cc'}
        onBlur={(e) => e.target.style.borderColor = '#ddd'}
      />
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Mostrando <strong>{alumnosFiltrados}</strong> de <strong>{totalAlumnos}</strong> alumnos
      </p>
    </div>
  );
};

export default SearchBar;