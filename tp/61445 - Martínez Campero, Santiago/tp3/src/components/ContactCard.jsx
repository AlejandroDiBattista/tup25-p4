import { getIniciales } from '../utils/text.js';

const ContactCard = ({ alumno, onToggleFavorito }) => {
  return (
    <div 
      style={{ 
        border: alumno.esFavorito ? '2px solid #ffd700' : '1px solid #ddd',
        padding: '15px', 
        borderRadius: '8px',
        backgroundColor: alumno.esFavorito ? '#fffacd' : '#f9f9f9',
        position: 'relative'
      }}
    >
      <button
        onClick={() => onToggleFavorito(alumno.legajo)}
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
  );
};

export default ContactCard;