import React, { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import ContactSection from "./components/ContactSection";
import { loadAlumnos } from "./services/alumnos";

function App() {
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    const data = loadAlumnos();
    setAlumnos(data);
  }, []);

  return (
    <>
      <Topbar />
      <main>
        <ContactSection title="Contactos" contacts={alumnos} />
      </main>
    </>
  );
}

export default App;
