"use client";

import UserForm from "@/components/UserForm";
import MultipleChoice from "@/components/MultipleChoice";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

export default function Home() {
  // Datos de ejemplo para mostrar
  const userData: FormData = {
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "+1234567890",
    email: "juan.perez@example.com"
  };

  // Ejemplo de pregunta de múltiples opciones con markdown
  const sampleQuestion = `¿Cuál es la **capital** de Francia?

Considera la siguiente información:
- Francia es un país europeo
- Su capital es una ciudad muy \`famosa\`
- Es conocida por la **Torre Eiffel**`;

  const sampleOptions = [
    "**Londres** - Capital de *Inglaterra*",
    "**París** - Capital de *Francia* 🇫🇷",
    "**Madrid** - Capital de *España*",
    "~~Roma~~ - Capital de *Italia*"
  ];

  // Segundo ejemplo con código JavaScript
  const codingQuestion = `¿Cuál de los siguientes códigos JavaScript **crea correctamente** un array?

Analiza cada opción cuidadosamente:`;

  const codingOptions = [
    "```js\nconst arr = [];``` - Array vacío",
    "```js\nconst arr = new Array();``` - Constructor de Array",
    "```js\nconst arr = [1, 2, 3];``` - Array con elementos",
    "**Todas las anteriores** son correctas ✅"
  ];

  // Función para el segundo ejemplo
  const handleCodingAnswerSubmit = (selectedOption: string, selectedIndex: number) => {
    console.log("Respuesta coding:", selectedOption, selectedIndex);
    if (selectedIndex === 3) {
      alert("¡Correcto! Todas las opciones son formas válidas de crear arrays.");
    } else {
      alert("Incorrecto. Todas las opciones son formas válidas de crear arrays.");
    }
  };
  const handleAnswerSubmit = (selectedOption: string, selectedIndex: number) => {
    console.log("Respuesta seleccionada:", selectedOption);
    console.log("Índice de la respuesta:", selectedIndex);
    
    // Aquí puedes agregar lógica adicional como verificar si es correcta
    if (selectedIndex === 1) { // París es la respuesta correcta (índice 1)
      alert("¡Correcto! París es la capital de Francia.");
    } else {
      alert("Incorrecto. La respuesta correcta es París.");
    }
  };

  // Ejemplo de contenido markdown con código
  const markdownContent = 
`# Esto es genial

Puedo **destacar** o __subrayar__ texto fácilmente.

Este es un ejemplo de **markdown** con código coloreado.

## Componente básico

Aquí tienes un ejemplo de un componente React:

\`\`\`tsx
import React from 'react';

interface Props {
  name: string;
  age?: number;
}

const UserProfile: React.FC<Props> = ({ name, age }) => {
  return (
    <div className="user-profile">
      <h2>Hola, {name}!</h2>
      {age && <p>Edad: {age} años</p>}
    </div>
  );
};

export default UserProfile;
\`\`\`

## Hook personalizado

También puedes usar \`useState\` para manejar el estado:

\`\`\`javascript
import { useState, useEffect } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
\`\`\`

## Características principales

- ✅ **Syntax highlighting** automático
- ✅ **Múltiples lenguajes** soportados
- ✅ **Estilos de shadcn/ui** integrados
- ✅ **Responsive** y accesible

> **Nota:** Este componente usa \`react-markdown\` y \`react-syntax-highlighter\` para una experiencia completa.

## Comando de instalación

Para instalar las dependencias:

\`\`\`bash
npm install react-markdown react-syntax-highlighter
npm install @types/react-syntax-highlighter
\`\`\`

¡Y eso es todo! 🚀`;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Componente de información de usuario */}
      <div className="max-w-md">
        <UserForm 
          data={userData}
          title="Mi Perfil de Usuario"
          description="Información personal de solo lectura"
        />
      </div>

      {/* Componente de pregunta de múltiples opciones */}
      <div className="max-w-2xl">
        <MultipleChoice
          question={sampleQuestion}
          options={sampleOptions}
          questionNumber={1}
          onAnswer={handleAnswerSubmit}
          title="Pregunta de Geografía"
          allowMultipleAttempts={true}
        />
      </div>

      {/* Segundo componente de pregunta con código */}
      <div className="max-w-2xl">
        <MultipleChoice
          question={codingQuestion}
          options={codingOptions}
          questionNumber={2}
          onAnswer={handleCodingAnswerSubmit}
          title="Pregunta de Programación"
          allowMultipleAttempts={true}
        />
      </div>

      {/* Componente de renderizado de markdown */}
      <div className="max-w-4xl">
        <MarkdownRenderer
          content={markdownContent}
          title="Documentación Técnica"
          description="Ejemplo de markdown con código coloreado"
          showCard={true}
        />
      </div>
    </div>
  );
}
