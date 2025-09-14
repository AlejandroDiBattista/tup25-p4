import { useState, useEffect } from 'react';
import { loadAlumnos } from './services/alumnos.js';
import { includesContacto, cmpNombre } from './utils/text.js';
import SearchBar from './components/SearchBar.jsx';
import ContactSection from './components/ContactSection.jsx';
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

  const favoritosArray = alumnosFiltrados.filter(a => a.esFavorito);
  const noFavoritosArray = alumnosFiltrados.filter(a => !a.esFavorito);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>📚 Directorio de Alumnos</h1>
        <p>Total de alumnos: <strong>{alumnos.length}</strong></p>
        
        <SearchBar 
          totalAlumnos={alumnos.length}
          alumnosFiltrados={alumnosFiltrados.length}
          onBusqueda={setBusqueda}
        />
      </header>
      
      <main>
        {alumnosFiltrados.length === 0 && busqueda.trim() ? (
          <ContactSection 
            mostrarVacio={true}
            mensajeVacio={
              <>
                <p>No se encontraron alumnos que coincidan con "{busqueda}"</p>
                <p>Intenta con otro término de búsqueda</p>
              </>
            }
          />
        ) : (
          <>
            {favoritosArray.length > 0 && (
              <ContactSection 
                titulo="⭐ Favoritos"
                alumnos={favoritosArray}
                onToggleFavorito={toggleFavorito}
              />
            )}
            
            <ContactSection 
              titulo={favoritosArray.length > 0 ? "👥 Todos los demás" : null}
              alumnos={noFavoritosArray}
              onToggleFavorito={toggleFavorito}
            />
          </>
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
