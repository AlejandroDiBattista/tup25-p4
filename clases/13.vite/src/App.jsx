import { useState, useEffect } from 'react'

import { Agenda, Contacto } from './components'
import alumnos from './assets/alumnos.vcf?raw'

import './App.css'

function parseVCF(data) {
  const cards = data.split('BEGIN:VCARD').slice(1);
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
    const contactos = parseVCF(alumnos);
    setContactos(contactos);
  }, []);

  return (
    <>
      <Agenda contactos={contactos}/>
    </>
  )
}

export default App
