import React, { useState, useEffect, useMemo } from 'react';
import { loadAlumnos } from './services/alumnos';
import { includesContacto, cmpNombre } from './utils/text';
import Topbar from './components/Topbar';
import ContactSection from './components/ContactSection';
import './App.css'; 

function App() {
    // Estado inicial de todos los alumnos y el término de búsqueda
    const [alumnos, setAlumnos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Carga inicial de datos
    useEffect(() => {
        setAlumnos(loadAlumnos());
    }, []);

    // 2. Función para alternar el estado de favorito
    const toggleFavorito = (legajo) => {
        setAlumnos(prevAlumnos =>
            prevAlumnos.map(alumno =>
                alumno.legajo === legajo
                    ? { ...alumno, favorito: !alumno.favorito }
                    : alumno
            )
        );
    };

    // 3. Filtrado, Agrupación y Ordenamiento (Memorizado)
    const { favoritos, noFavoritos } = useMemo(() => {
        
        // A. Filtrar por término de búsqueda
        const filteredAlumnos = alumnos.filter(alumno =>
            includesContacto(alumno, searchTerm)
        );

        // B. Agrupar, Ordenar y Asignar títulos
        const favs = filteredAlumnos
            .filter(a => a.favorito)
            .sort(cmpNombre);

        const nonFavs = filteredAlumnos
            .filter(a => !a.favorito)
            .sort(cmpNombre);

        return { favoritos: favs, noFavoritos: nonFavs };
    }, [alumnos, searchTerm]); // Se recalcula si cambian los alumnos o el término

    const totalResults = favoritos.length + noFavoritos.length;
    const isListEmpty = totalResults === 0 && searchTerm !== '';

    return (
        <div className="app-container">
            <Topbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <main className="main-content">
                {isListEmpty ? (
                    <p className="empty-message">
                        No se encontraron alumnos para la búsqueda: **"{searchTerm}"**.
                    </p>
                ) : (
                    <>
                        {/* Grupo 1: Favoritos */}
                        <ContactSection
                            title="Favoritos"
                            contacts={favoritos}
                            onToggleFavorite={toggleFavorito}
                        />

                        {/* Separador visual opcional aquí si es necesario */}

                        {/* Grupo 2: No Favoritos */}
                        <ContactSection
                            title="Contactos"
                            contacts={noFavoritos}
                            onToggleFavorite={toggleFavorito}
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default App;