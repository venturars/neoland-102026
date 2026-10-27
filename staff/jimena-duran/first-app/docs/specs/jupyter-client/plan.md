# Plan — cliente Jupyter

## Arquitectura y tecnologías

JupyterLab con kernel Python ejecuta fragmentos ESM mediante Node.js.
Los notebooks llaman a `logic/`; preparar la tabla reutiliza `queries/users.js`.
Se mantienen la conexión y la base SQLite actuales. El recuento utiliza
Ollama local con `llama3.2`.

## Archivos

- `clients/jupyter/`: nueve `.ipynb`, con los mismos nombres que sus clientes
  de terminal. La guía de apertura y recorrido está en `docs/JUPYTER.md`.
- `docs/specs/jupyter-client/`: especificación, plan y tareas.

## Decisiones técnicas

- Una celda por acción; `subprocess` sin shell, resultado JSON y tabla de
  texto ANSI. Solo biblioteca estándar, sin formularios ni paquetes nuevos.
- Conservar las firmas actuales de `createUser` y `updateUser`, según la
  decisión aprobada, sin modificar lógica ni constitución.
- Usar `demo.jimena.jupyter@example.com` para localizar el ID de demo antes
  de consultar, actualizar o eliminar. Referencia: llamadas de `clients/terminal/`.
- Guardar notebooks sin salidas personales. Verificar recorrido, errores,
  presentación y clasificación real antes de presentar los cambios.
- Abrir la demo sin token ni contraseña, limitada a `127.0.0.1`.
