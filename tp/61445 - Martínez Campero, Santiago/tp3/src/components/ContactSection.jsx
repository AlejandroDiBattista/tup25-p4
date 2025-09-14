import ContactCard from './ContactCard.jsx';

const ContactSection = ({ titulo, alumnos, onToggleFavorito, mostrarVacio = false, mensajeVacio }) => {
  if (alumnos.length === 0 && !mostrarVacio) {
    return null;
  }

  if (alumnos.length === 0 && mostrarVacio) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>{mensajeVacio}</p>
      </div>
    );
  }

  return (
    <section style={{ marginBottom: '30px' }}>
      {titulo && (
        <h2 style={{ 
          fontSize: '18px', 
          color: '#333', 
          marginBottom: '15px',
          borderBottom: '2px solid #ddd',
          paddingBottom: '5px'
        }}>
          {titulo} ({alumnos.length})
        </h2>
      )}
      
      <div style={{ 
        display: 'grid', 
        gap: '10px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {alumnos.map(alumno => (
          <ContactCard 
            key={alumno.legajo}
            alumno={alumno}
            onToggleFavorito={onToggleFavorito}
          />
        ))}
      </div>
    </section>
  );
};

export default ContactSection;