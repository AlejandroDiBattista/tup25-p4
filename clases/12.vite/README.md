# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Efecto de desenfoque detrás del modal

Se implementó un overlay para el componente `Modal` que aplica un desenfoque al contenido que queda detrás cuando el diálogo está visible.

- CSS: `.modal-backdrop { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }`
- También se agrega la clase `modal-open` al `<body>` para bloquear el scroll mientras el modal está abierto.

Compatibilidad:
- `backdrop-filter` funciona en navegadores modernos (Chrome/Edge/Opera, Safari). En Firefox, requiere habilitar `layout.css.backdrop-filter.enabled` en `about:config`. Si no está soportado, se verá el overlay oscurecido sin desenfoque.

Prueba manual:
1. Inicia el servidor de desarrollo.
2. Abre la app, pulsa “Nuevo” o edita un contacto.
3. Verifica que el contenido de fondo se vea borroso y que no se pueda hacer scroll del fondo.
