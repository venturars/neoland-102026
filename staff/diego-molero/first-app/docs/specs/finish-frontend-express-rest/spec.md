# Frontend completo y API REST de usuarios

Issue: #855. Fecha: 2026-11-04. Diego autorizó implementación y entrega en una sola PR contra `staging`.

## Necesidad

Quien usa first-app debe poder preparar y gestionar un usuario desde el navegador, además de trabajar con sus notas. Quien prueba la aplicación necesita una API REST de usuarios hecha con Express y una colección que pueda ejecutar con Postman. La automatización Git debe incorporar las reglas vigentes de `exercises/git-workflow-agent-template` sin perder las protecciones locales.

## Recorrido

1. Abrir la aplicación web y ver usuarios existentes, su ID y nombre. Si no hay ninguno, crear el primero con nombre y correo, sin contraseña.
2. Seleccionar un usuario, volver a la lista, editarlo o ir a sus notas. Crear, consultar, modificar y borrar notas con confirmación en los borrados.
3. Crear, listar, consultar, modificar y borrar usuarios mediante HTTP; cada petición llama a `src/logic/` y devuelve JSON o 204.
4. Importar la colección Postman y ejecutar el recorrido CRUD contra una base temporal, incluidos errores de entrada y ausencias.

## Criterios de aceptación

- **F-01:** El cliente web permite crear un usuario con nombre y correo. Al guardarlo aparece en la lista con su ID; un correo repetido o datos inválidos conservan el formulario y explican el error.
- **F-02:** La selección, menú, edición y notas existentes siguen funcionando. Los borrados piden confirmación; cancelar no escribe. La selección se limpia al recargar.
- **F-03:** La interfaz muestra estados de carga, listas vacías, mensajes accesibles, foco visible y diseño legible a 390 px. El texto de usuarios y notas se inserta como texto, sin interpretar HTML.
- **F-04:** Una única aplicación Express escucha en `127.0.0.1`, sirve los archivos web permitidos y conserva las rutas `/api/users` y `/api/users/:userId/notes` actuales. Añade `POST /api/users`; el navegador y Postman pueden usar el mismo origen.
- **F-05:** Crear devuelve 201 con el usuario, listar 200 con lista, consultar y modificar 200 con usuario, y borrar 204 sin cuerpo. Las reglas de validación y persistencia siguen en `logic` y `queries`.
- **F-06:** Los métodos no admitidos, IDs inválidos, JSON incorrecto, cuerpos grandes, correos duplicados y recursos ausentes producen estados HTTP y mensajes de error claros. La ruta de archivos públicos no expone la base ni archivos internos.
- **F-07:** La colección Postman contiene el recorrido de usuarios y comprobaciones de respuesta; se ejecuta contra una copia aislada y registra resultados reales, sin modificar la base personal.
- **F-08:** El workflow reconoce cuándo una issue está lista, crea la rama desde `staging` antes de cambiar el proyecto, usa las doce plantillas, enlaza la issue desde la PR y sigue la escritura directa de GitHub. Conserva el prefijo `codex/`, la delegación real, la protección de ramas y push, el control de duplicados y los roles humanos.
- **F-09:** Todo se entrega en la issue #855 y una sola PR draft. Código, textos y colección son UTF-8; las funcionalidades nuevas tienen comentarios breves. No se incluyen bases, credenciales ni entornos.

## Alcance

El cliente Express ocupa el lugar del transporte `node:http` de la web actual; no cambia el contrato de usuarios y notas ni crea un servidor SQL abierto. Las operaciones de notas y los clientes de terminal y Jupyter siguen llamando a la misma lógica. No hay autenticación, despliegue público ni cambios de `asistenciapp`.

[Plan](plan.md) · [Tareas](tasks.md) · [Cliente web anterior](../vanilla-web-client/spec.md) · [Workflow anterior](../git-workflow/spec.md).
