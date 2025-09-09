# React:

## Introducción a React

React es una biblioteca de JavaScript para construir interfaces de usuario. Fue desarrollada por Facebook y se utiliza ampliamente en la industria para crear aplicaciones web interactivas y dinámicas.

## Cómo surge React?

React surge para generar aplicaciones dinámicas y eficientes.

Antes de React, la manipulación del DOM (Document Object Model) era costosa y propensa a errores, especialmente en aplicaciones complejas. React introduce el concepto de Virtual DOM, que permite actualizar solo las partes necesarias de la interfaz de usuario, mejorando significativamente el rendimiento.

React nos permite crear interfaces declarativas y reactivas. Declarativas porque describimos cómo se ve la UI en un determinado estado y React se encarga de actualizarla cuando el estado cambia. Reactiva porque la UI responde automáticamente a los cambios en los datos.

## Características principales de React
- **Componentes**: React se basa en componentes reutilizables que encapsulan la lógica y la presentación de una parte de la interfaz de usuario. Permiten crear piezas independientes con su propia lógica y estilo.
- **JSX**: Una extensión de sintaxis que permite escribir HTML dentro de JavaScript, facilitando la creación de componentes.
- **Virtual DOM**: React utiliza un DOM virtual para mejorar el rendimiento al minimizar las manipulaciones directas del DOM real.
- **Unidirectional Data Flow**: Los datos fluyen en una sola dirección, lo que facilita el seguimiento de los cambios y la depuración.
- **Ecosistema**: React tiene un ecosistema rico con muchas bibliotecas y herramientas complementarias, como React Router para el enrutamiento y Redux para la gestión del estado.

## Ejemplo básico de un componente React usando createElement

```js
import React from 'react';

const MiComponente = () => {
    return React.createElement('div', null,
        React.createElement('h1', null, 'Hola, mundo!'),
        React.createElement('p', null, 'Este es un componente básico de React usando createElement.')
    );
};

// Equivalente en JSX
const MiComponenteJSX = () => {
    return (
        <div>
            <h1>Hola, mundo!</h1>
            <p>Este es un componente básico de React usando createElement.</p>
        </div>
    );
};

/* HTML generado:
<div>
  <h1>Hola, mundo!</h1>
  <p>Este es un componente básico de React usando createElement.</p>
</div>
*/

export default MiComponente;
```
