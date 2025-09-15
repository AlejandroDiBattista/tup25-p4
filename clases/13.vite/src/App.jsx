import { useState, useEffect } from 'react'

import { Agenda, Contacto } from './components'
import vcfContent from './assets/alumnos.vcf?raw'

import './App.css'


function parseVCF(vcfContent) {
  const cards = vcfContent.split('BEGIN:VCARD').slice(1);
  const alumnos = cards.map(card => {
    const lineas = card.split('\n');
    let nombre, telefono, legajo, comision;
    for (const linea of lineas) {
      let partes = linea.split(":");
      if (linea.startsWith('FN')) {
        nombre = partes[1];
      } else if (linea.startsWith('TEL')) {
        telefono = partes[1];
      } else if (linea.startsWith('NOTE')) {
        legajo   = partes[2].substr(0,6)
        comision = partes[3]
      }
    }
    return { nombre, telefono, legajo, comision };
  });
  return alumnos;
}

function App() {
  let [contactos, setContactos] = useState([]);
  useEffect(() => {
    const contactos = parseVCF(vcfContent);
    setContactos(contactos);
  }, []);

  
  return (
    <>
      <pre style={{ textAlign: 'left' }}>{contactos.length > 0 ? JSON.stringify(contactos, null, 2) : 'No hay contactos'}</pre>
      <Contacto {...contactos[0]} />
      <hr/>
      <Agenda contactos={contactos}/>
    </>
  )
}export default App
