import { useState, useEffect } from 'react';
import { loadAlumnos } from './services/alumnos.js';
import { includesContacto, debounce, cmpNombre, getIniciales } from './utils/text.js';
function App() {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [favoritos, setFavoritos] = useState(new Set());

  useEffect(() => {
    try {
      setCargando(true);
      const datosAlumnos = loadAlumnos();
      setAlumnos(datosAlumnos);
      setAlumnosFiltrados(datosAlumnos);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los datos de los alumnos');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let alumnosParaMostrar = alumnos;
    
    if (busqueda.trim()) {
      alumnosParaMostrar = alumnos.filter(alumno => 
        includesContacto(alumno, busqueda)
      );
    }
    
    const alumnosConFavoritos = alumnosParaMostrar.map(alumno => ({
      ...alumno,
      esFavorito: favoritos.has(alumno.legajo)
    }));
    
    const favoritosArray = alumnosConFavoritos.filter(a => a.esFavorito).sort(cmpNombre);
    const noFavoritosArray = alumnosConFavoritos.filter(a => !a.esFavorito).sort(cmpNombre);
    
    setAlumnosFiltrados([...favoritosArray, ...noFavoritosArray]);
  }, [alumnos, busqueda, favoritos]);

  const manejarBusqueda = debounce((termino) => {
    setBusqueda(termino);
  }, 300);

  const toggleFavorito = (legajo) => {
    setFavoritos(favoritosActuales => {
      const nuevosFavoritos = new Set(favoritosActuales);
      if (nuevosFavoritos.has(legajo)) {
        nuevosFavoritos.delete(legajo);
      } else {
        nuevosFavoritos.add(legajo);
      }
      return nuevosFavoritos;
    });
  };

  if (cargando) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Directorio de Alumnos</h1>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Directorio de Alumnos</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>📚 Directorio de Alumnos</h1>
        <p>Total de alumnos: <strong>{alumnos.length}</strong></p>
        
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
            Mostrando <strong>{alumnosFiltrados.length}</strong> de <strong>{alumnos.length}</strong> alumnos
          </p>
        </div>
      </header>
      <main>
        {alumnosFiltrados.length === 0 && busqueda.trim() ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No se encontraron alumnos que coincidan con "{busqueda}"</p>
            <p>Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '10px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {alumnosFiltrados.map(alumno => (
              <div 
                key={alumno.legajo} 
                style={{ 
                  border: alumno.esFavorito ? '2px solid #ffd700' : '1px solid #ddd',
                  padding: '15px', 
                  borderRadius: '8px',
                  backgroundColor: alumno.esFavorito ? '#fffacd' : '#f9f9f9',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => toggleFavorito(alumno.legajo)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                  title={alumno.esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {alumno.esFavorito ? '⭐' : '☆'}
                </button>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: alumno.github ? 'transparent' : '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#666',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    {alumno.github ? (
                      <img 
                        src={`https://github.com/${alumno.github}.png?size=100`}
                        alt={`Avatar de ${alumno.nombre}`}
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.textContent = getIniciales(alumno.nombre);
                        }}
                      />
                    ) : (
                      getIniciales(alumno.nombre)
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                      {alumno.nombre}
                    </h3>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      📞 Teléfono: {alumno.telefono}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      🎓 Legajo: {alumno.legajo}
                    </p>
                    {alumno.github && (
                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#0066cc' }}>
                        💻 GitHub: <a href={`https://github.com/${alumno.github}`} target="_blank" rel="noopener noreferrer">{alumno.github}</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
        <p>Alumnos con GitHub: {alumnosFiltrados.filter(a => a.github).length}</p>
        <p>Favoritos: {favoritos.size}</p>
        {busqueda.trim() && (
          <p>Búsqueda activa: "{busqueda}"</p>
        )}
      </footer>
    </div>
  );
}

export default App;
