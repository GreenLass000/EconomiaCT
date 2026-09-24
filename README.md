# Economía Comunidad Terapéutica

Aplicación React con Vite y backend Flask.

## Requisitos

- Python 3
- Node.js 24 LTS y npm
- MySQL configurado en `flask_app/.env`

La versión de Node del frontend está fijada en `react_app/.nvmrc` y declarada en
`react_app/package.json`. En Windows se puede instalar Node 24 LTS con el
instalador `.msi` oficial de [nodejs.org](https://nodejs.org/en/download/).
Esto no requiere reemplazar la versión usada por otras aplicaciones si se
gestiona la instalación por proyecto con un gestor de versiones.

## Inicio en Windows

Ejecuta `start.bat`. El script instala las dependencias, construye el frontend
y abre Flask y la previsualización de Vite en ventanas separadas:

- Frontend: <http://localhost:3000>
- API: <http://localhost:5000>

## Desarrollo del frontend

Desde `react_app`:

```bash
npm ci
npm run start
```

El frontend llama directamente a Flask en el puerto 5000; Flask-CORS permite
el acceso desde el frontend. Para generar y previsualizar el build de producción:

```bash
npm run build
npm run preview
```

Para cambiar la URL de API usada por el build, define `VITE_API_URL` antes de
ejecutar `npm run build`. Por defecto usa el host actual en el puerto 5000.
