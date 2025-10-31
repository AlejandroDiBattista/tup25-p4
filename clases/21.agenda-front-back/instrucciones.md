# Requerimientos del Sistema de Agenda de Contactos

## Alcance General
- Sistema full-stack que integre un backend en Python con un frontend en Next.js.
- Funcionalidad principal: administración de una agenda de contactos.

## Modelo de Datos
- Cada contacto debe incluir: nombre, apellido, email y una colección de teléfonos.
- Debe permitirse gestionar múltiples teléfonos por contacto.

## Backend
- Implementado con Python utilizando FastAPI.
- ORM: SQLModel; base de datos: SQLite.
- Uso de DTOs y dependencias (`Depends`) para simplificar la creación del API.
- Endpoints necesarios:
  - Listado de contactos con búsqueda dinámica.
  - Alta, edición y eliminación de contactos.
  - Recuperación individual de un contacto.
- La creación y edición de contactos debe admitir agregar y borrar múltiples teléfonos. Un teléfono en blanco debe eliminarse automáticamente.
- Al confirmar una operación, el listado debe reflejar los cambios.

## Frontend
- Desarrollado con Next.js (última versión disponible).
- Estilizado con Tailwind CSS y componentes shadcn/ui.
- La comunicación con el backend debe encapsularse en un módulo de servicios.
- Requerimientos de UI/UX:
  - Listado de contactos con búsqueda dinámica.
  - Contactos representados como tarjetas personales.
  - Navegación a la página de edición al hacer clic en una tarjeta.
  - Páginas separadas para alta y edición de contactos, con capacidad de agregar/eliminar teléfonos.
  - Eliminación del contacto disponible durante la edición.
  - Opciones de cancelar o confirmar en alta/edición; al confirmar, volver al listado actualizado.
