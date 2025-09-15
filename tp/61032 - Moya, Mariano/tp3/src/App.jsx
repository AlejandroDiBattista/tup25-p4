import React, { useState, useMemo } from 'react';
import alumnosVcf from './alumnos.vcf?raw';
import { parseVcf, loadAlumnos } from './services/alumnos';
import { norm, cmpNombre, includesContacto } from './utils/text';

function Topbar({ value, onChange }) {
  return (
    <header style={{padding: '2rem 0 1rem 0', borderBottom: '1px solid #eee', marginBottom: '2rem'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <h1 style={{margin: 0, fontWeight: 700, fontSize: '2rem'}}>Alumnos Programación 4</h1>
        <input
          type="search"
          placeholder="Buscar por nombre, teléfono o legajo"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{padding: '0.7rem 2.5rem 0.7rem 2.5rem', borderRadius: '2rem', border: '1px solid #ddd', fontSize: '1rem', minWidth: 320, background: '#fff', backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23999\' height=\'18\' viewBox=\'0 0 18 18\' width=\'18\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M12.5 11h-.79l-.28-.27A6.471 6.471 0 0013 7.5 6.5 6.5 0 106.5 14c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99c.41.41 1.09.41 1.5 0s.41-1.09 0-1.5l-4.99-5zm-6 0C5.01 11 3 8.99 3 6.5S5.01 2 7.5 2 12 4.01 12 6.5 9.99 11 7.5 11z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: '0.7rem center'}}
        />
      </div>
    </header>
  );
}

function ContactCard({ alumno, onFav }) {
  const avatar = alumno.github
    ? <img src={`https://github.com/${alumno.github}.png?size=100`} alt={alumno.nombre} style={{width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', background: '#eee'}} />
    : <div style={{width: 56, height: 56, borderRadius: '50%', background: '#e0e0e0', color: '#666', fontWeight: 700, fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{alumno.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>;
  return (
    <div style={{background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0', padding: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', minWidth: 320}}>
      {avatar}
      <div style={{flex: 1}}>
        <div style={{fontWeight: 700, fontSize: '1.1rem', marginBottom: 4}}>{alumno.nombre}</div>
        <div style={{fontSize: '0.98rem', color: '#333'}}>Tel: <b>{alumno.telefono}</b></div>
        <div style={{fontSize: '0.98rem', color: '#333'}}>Legajo: <b>{alumno.legajo}</b></div>
      </div>
      <button onClick={onFav} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: 12, right: 12, fontSize: 22}} title={alumno.favorito ? 'Quitar de favoritos' : 'Marcar como favorito'}>
        <span style={{color: alumno.favorito ? '#ffc107' : '#bbb'}}>★</span>
      </button>
    </div>
  );
}

function ContactSection({ title, contacts, onFav }) {
  return (
    <section style={{marginBottom: '2.5rem'}}>
      <h2 style={{fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem'}}>{title} <span style={{color: '#888', fontWeight: 400}}>({contacts.length})</span></h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem'}}>
        {contacts.map(alumno => (
          <ContactCard key={alumno.id} alumno={alumno} onFav={() => onFav(alumno.id)} />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [alumnos, setAlumnos] = useState(() => loadAlumnos(parseVcf(alumnosVcf)));

  // Filtrado y agrupación
  const { favoritos, contactos } = useMemo(() => {
    const filtrados = alumnos.filter(a => includesContacto(a, busqueda));
    const favs = filtrados.filter(a => a.favorito).sort(cmpNombre);
    const rest = filtrados.filter(a => !a.favorito).sort(cmpNombre);
    return { favoritos: favs, contactos: rest };
  }, [alumnos, busqueda]);

  const handleFav = id => {
    setAlumnos(alumnos => alumnos.map(a => a.id === id ? {...a, favorito: !a.favorito} : a));
  };

  return (
    <div style={{background: '#f7f8fa', minHeight: '100vh', paddingBottom: '2rem'}}>
      <Topbar value={busqueda} onChange={setBusqueda} />
      <main style={{maxWidth: 1200, margin: '0 auto', padding: '0 2rem'}}>
        {favoritos.length > 0 && <ContactSection title="Favoritos" contacts={favoritos} onFav={handleFav} />}
        <ContactSection title="Contactos" contacts={contactos} onFav={handleFav} />
        {favoritos.length === 0 && contactos.length === 0 && (
          <div style={{textAlign: 'center', color: '#888', marginTop: '3rem', fontSize: '1.2rem'}}>No se encontraron alumnos.</div>
        )}
      </main>
    </div>
  );
}

