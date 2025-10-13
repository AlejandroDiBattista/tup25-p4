import React, {useEffect, useState} from "react";
import "./App.css"

let datosIniciales = [
  {id: 1, nombre: "Ana",  edad: 25},
  {id: 2, nombre: "Luis", edad: 30},
  {id: 3, nombre: "Pepe", edad: 28},
];

// Funciones auxiliares para leer/escribir el localStorage
function leerLista(clave, inicial) {
  let datos = localStorage.getItem(clave);
  if(datos) {
    return JSON.parse(datos);
  }
  return inicial;
}

function escribirLista(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

// Hook personalizado que admnistra una lista y la presiste en localStorage
function useList(inicial) {
  // Gestiona el estado de la lista.
  let [lista, setLista] = useState(()=>leerLista("lista", inicial));

  // Cada vez que cambia la lista, se actualiza el localStorage
  useEffect(() => {
    escribirLista("lista", lista);
  }, [lista]);

  // Agrega un elemento a la lista (con id nuevo)
  function agregar(nuevo) {
    // Busca el id maximo y le agrega 1
    const id = Math.max(0,...lista.max(item => item.id)) + 1;

    // Copia la lista y le agrega una copia de registro
    setLista([...lista, {id, ...nuevo}]);
  }
  
  function cambiar(id, nuevo) {
    // El elemento a cambiar se copia y se actualiza los campos nuevos
    setLista(lista.map(item => item.id === id ? {...item, ...nuevo} : item ));
  }

  function borrar(id) {
    // Deja todo excepto el que quiere borrar
    setLista(lista.filter(item => item.id !== id));
  }

  return {lista, agregar, borrar, cambiar};
}


function App() {
  let {lista, agregar, cambiar, borrar} = useList(datosIniciales);
  
  return <>
    <h1>Agenda</h1>
    <ul>
      <button onClick={() => agregar({nombre: "Nuevo", edad: 0})}>Agregar</button>
      {lista.map(d => 
          <li key={d.id}>
            <span>{d.nombre} <i>({d.edad} años)</i></span>
            <button onClick={() => cambiar(id, {edad: d.edad + 1})}>Cumplir años</button>
            <button onClick={() => borrar(d.id)}>Borrar</button>
          </li>
      )}

    </ul>
  </>
}

export default App
