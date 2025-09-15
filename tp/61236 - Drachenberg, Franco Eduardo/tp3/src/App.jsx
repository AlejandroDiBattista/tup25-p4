import React, { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import ContactSection from "./components/ContactSection";
import { loadAlumnos } from "./services/alumnos";
import { normalizar } from "./utils/text";

function App() {
  const [alumnos, setAlumnos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const data = loadAlumnos();
    setAlumnos(data);
  }, []);

  const handleSearch = (termino) => {
    setBusqueda(termino);
  };

  const includesContacto = (contacto, busqueda) => {
    const busquedaNorm = normalizar(busqueda);
    const { nombre, legajo, telefono } = contacto;

    return (
      normalizar(nombre).includes(busquedaNorm) ||
      normalizar(legajo).includes(busquedaNorm) ||
      normalizar(telefono).includes(busquedaNorm)
    );
  };

  const alumnosFiltrados = busqueda
    ? alumnos.filter((alumno) => includesContacto(alumno, busqueda))
    : alumnos;

  return (
    <>
      <Topbar onSearch={handleSearch} />
      <main>
        <ContactSection title="Contactos" contacts={alumnosFiltrados} />
      </main>
    </>
  );
}

export default App;
