# Historial anual — Informe de auditoría

## Fecha

- 2026-07-29

## Alcance revisado

- Ruta/pantalla: panel principal y sus tablas de movimientos.
- Archivos: `react_app/src/App.js`, AppBar, DetailTable, InteractiveList y `usePersons`; `flask_app/routes/record.py`.
- Suposición de ejecución: React se ejecuta con el proxy configurado hacia Flask.

## Clasificación de stack

- React 18 para la interfaz y Flask/SQLAlchemy para la API.

## Entradas y metodología

- Guías aplicadas: Web Interface Guidelines, prácticas de React de Vercel, patrones de composición y frontend design.
- Se revisaron el flujo de datos de las tablas, los diálogos de detalle, las peticiones de movimientos y los endpoints relacionados.
- La validación se limita a análisis estático y compilación; no hay pruebas automatizadas en el repositorio.

## Resumen ejecutivo

El panel cargaba todos los movimientos sin límite temporal. Se ha incorporado un filtro anual aplicado en el servidor y un menú de Historial que permite abrir los años anteriores. Las incidencias más relevantes que permanecen son la ausencia de autenticación/autorización en la API y varias URLs privadas codificadas en el cliente.

## Hallazgos por severidad

### Crítico

- No se confirmaron incidencias críticas dentro del alcance.

### Alto

- **API sin barrera de autorización (riesgo confirmado).** Cualquier cliente con acceso de red puede consultar, editar o eliminar movimientos con IDs conocidos. Evidencia: `flask_app/routes/record.py`. Recomendación: exigir autenticación y comprobar el rol/ámbito antes de cada lectura o escritura.

### Medio

- **Host de API codificado (riesgo confirmado).** Varias pantallas siguen usando `http://192.168.1.118:5000`, lo que rompe despliegues fuera de esa red y mezcla el proxy local con una IP fija. Evidencia: `react_app/src/components/DetailTable/index.jsx`, `react_app/src/components/Interactivelist/hooks/usePersons.js` y otros consumidores de Axios. Recomendación: centralizar una `baseURL` configurable por entorno.
- **N+1 de peticiones para saldos (riesgo confirmado).** La carga de personas solicita un listado de movimientos por cada persona. Evidencia: `usePersons.js:fetchPersons`. Recomendación: añadir un endpoint agregado de saldos por persona y año.

### Bajo

- **Estado anual no es enlazable (mejora).** El año activo vive en estado local, por lo que no se puede compartir ni restaurar al recargar. Evidencia: `react_app/src/App.js`. Recomendación: reflejarlo en `?year=` cuando se introduzca enrutado.
- **Acciones disponibles durante la consulta histórica (mejora).** Los detalles de un año anterior conservan edición y borrado. Evidencia: diálogos de `DetailTable` e `InteractiveList`. Recomendación: confirmar si el historial debe ser solo lectura y, de ser así, deshabilitar esas acciones.

## UI / UX / accesibilidad

- El nuevo menú emplea componentes MUI accesibles y comunica su estado expandido mediante atributos ARIA.
- El menú incluye estado vacío y una opción clara para regresar al año actual.
- Las tablas existentes muestran un estado vacío; el filtrado anual mantiene esa conducta.
- Pendiente: el panel de dos columnas no define una adaptación explícita para pantallas estrechas.

## Buenas prácticas específicas de React

- El año es estado propiedad de `App`, por lo que los dos paneles permanecen sincronizados.
- Las peticiones dependen de `selectedYear` y se rehacen al cambiarlo.
- La carga de saldos usa `Promise.all`, evitando una cascada secuencial, aunque aún requiere una petición por persona.

## Arquitectura / mantenibilidad

- El filtrado está en la API mediante un rango de fechas, no como una condición visual en React.
- El endpoint `/record/years` concentra el descubrimiento de años disponibles.
- Conviene extraer los paths de API y una capa de cliente Axios común antes de ampliar el módulo.

## Seguridad

- El frontend no protege datos; la seguridad debe aplicarse en Flask. La revisión no detectó sanitización de entrada adicional ni autenticación en el alcance revisado.
- El parámetro `year` se valida como entero antes de formar el rango de fechas, reduciendo entradas inválidas para esta nueva consulta.

## Mejoras transversales

- Añadir autenticación, una URL de API configurable y pruebas de integración para filtros anuales.
- Implementar un endpoint de balances agregados que reutilice el mismo filtro anual.

## Plan de acción priorizado

1. Proteger la API de movimientos y personas con autenticación y autorización.
2. Centralizar la configuración de Axios y eliminar IPs codificadas.
3. Sustituir las peticiones por persona por un agregado anual.
4. Sincronizar el año con la URL y decidir el modo de solo lectura del historial.

## Preguntas abiertas / supuestos

- Se asume que el historial debe mostrar solo años anteriores, mientras que la portada inicia siempre en el año actual desde el 1 de enero.
- Se asume que consultar datos históricos no debe impedir editar movimientos; confirmar si el historial debe ser de solo lectura.
