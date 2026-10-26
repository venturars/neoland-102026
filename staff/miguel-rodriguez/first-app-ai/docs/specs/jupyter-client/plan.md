# Plan · Cliente Jupyter

Fecha: 2026-10-26. Referencias: [spec](spec.md), [constitución](../../CONSTITUTIONS.md), issue #370 y PR #371, destino `staging`.

Miguel autorizó completar el trabajo pendiente, incluido Jupyter, y dejar las PR listas para revisión. Esta autorización conjunta sustituye las pausas por documento para esta entrega; no se presenta como tres aprobaciones independientes.

## Solución

Conservar `logic/`, `queries/`, `db/` y `clients/terminal/` sin cambios. Añadir nueve notebooks en `clients/jupyter/`, uno por cada operación de la spec. Utilizar el kernel Python de Jupyter: las celdas editan datos sencillos y llaman a `runNode(operation, *args)`. Ese pequeño adaptador de cliente serializa los argumentos como JSON y ejecuta un proceso Node con una ruta absoluta a `run-operation.js`. No construye ni evalúa código a partir de los datos.

El ejecutor JavaScript contiene un `switch` explícito de nueve operaciones. Cada caso llama a la función existente con sus argumentos; espera `usersGenderCount()`. Solo el cliente presenta resultados. Los errores conservan su mensaje, se escriben como errores y nunca producen una tabla de éxito. No se inicializa la tabla ni se crean contactos desde una consulta.

La ruta de la aplicación deriva de `client.py`, no de una búsqueda por carpetas ni del directorio desde el que se lanzó la terminal. Antes de ejecutar se comprueba el paquete `first-app-ai` y sus archivos esperados; si faltan, se muestra «No encuentro la app.». Los módulos Node mantienen sus rutas relativas al módulo y trabajan con el `db/users.sqlite` de esta copia.

`cli-table3@0.6.5`, dependencia de desarrollo con versión exacta, resuelve las tablas de consola, anchuras y encabezados de color sin crear un formateador propio. `openai@7.39.0` permanece intacto. pnpm genera el lockfile. El color se fuerza solo en el proceso del cliente para que sea visible dentro de Notebook.

## Arranque local

`pnpm jupyter` ejecuta `scripts/jupyter.js`. Prepara `node_modules` si falta el cliente, crea `.venv/` con Python del equipo, instala `notebook==7.6.3` e `ipykernel==7.1.0` desde `requirements-jupyter.txt` cuando falta el kernel o no coinciden sus versiones, registra un kernel `first-app-ai` dentro de ese entorno y arranca `python -m notebook` con raíz `clients/jupyter/`. Las siguientes ejecuciones reutilizan el entorno. El kernel local se registra de nuevo para que su ruta corresponda a esta copia.

Python se ejecuta sin shell: `python3` en macOS/Linux y `py -3` en Windows; el ejecutable del entorno usa `bin/python` o `Scripts/python.exe`. El servidor escucha en `127.0.0.1`, conserva la autenticación normal de Jupyter y abre el navegador. Se detiene con Ctrl+C. No se instalan paquetes globales ni se arranca Ollama.

Notebook 7.6.3 es un lanzamiento estable de [PyPI](https://pypi.org/project/notebook/7.6.3/); su kernel Python permite ejecutar el adaptador sin introducir un kernel JavaScript adicional. La ejecución desde navegador y las opciones del servidor siguen la [documentación de Notebook](https://jupyter-notebook.readthedocs.io/en/stable/running.html). El cliente utiliza [subprocess.run](https://docs.python.org/3/library/subprocess.html#subprocess.run) con una lista de argumentos, `shell=False` y JSON por stdin.

La revisión de #371 hace explícita la dependencia `ipykernel==7.1.0`, invocada para registrar el kernel y compatible con Python 3.10. Se comprueban ambas versiones y la importación del kernel antes de reutilizar el entorno; si falta, se reinstalan los requisitos. Notebook también puede traer ipykernel indirectamente a través de JupyterLab, pero el arranque no depende de esa relación. [Versión de ipykernel en PyPI](https://pypi.org/project/ipykernel/7.1.0/).

## Documentos

Cada notebook contiene título, qué hace, cambios en datos, acción utilizada, anotaciones, valores editables y resultado esperado. Todos pueden ejecutarse tras reiniciar el kernel. Los ID editables comienzan en `None`, explican dónde obtener el ID real y no ejecutan una consulta o escritura hasta sustituirlo. El borrado se describe como permanente. Las salidas guardadas y contadores permanecen vacíos.

El recuento explica la estimación de categorías y el requisito de Ollama local con `llama3.2`; el caso vacío no requiere modelo. Una caída no se sustituye por ceros. El README explica preparación, uso, datos, parada y prueba en una copia desechable.

## Comprobación de la constitución

- Se conserva Node ES modules, SQLite, esquema, operaciones, errores, prompt y ejemplos de terminal.
- Se añade únicamente un cliente y su presentación, sin nuevas operaciones ni capas de almacenamiento.
- Se autoriza una excepción acotada al `package.json` sin scripts: `jupyter`, su dependencia de desarrollo y los requisitos Python locales. Actualizar el árbol y esta excepción en la constitución.
- No se guardan entornos, bases de datos ni salidas personales. La verificación usa una copia desechable con datos ficticios.
- La autorización general de Miguel permite completar el proceso; el historial no inventa aprobaciones separadas.

## Verificación

1. Capturar hashes de lógica, consultas, conexión y terminal antes de editar; deben coincidir al terminar.
2. Validar formato y limpieza de los nueve notebooks.
3. Ejecutarlos con un kernel real en una copia desechable: inicialización explícita, creación, consultas, actualización y borrado con el ID realmente devuelto.
4. Probar lista y búsqueda vacías, normalización, errores existentes, conservación en lecturas y tabla no inicializada; confirmar que ningún error produce tabla de éxito.
5. Ejecutar recuento vacío y, si el servicio existente está disponible, no vacío real; distinguir cualquier bloqueo y simulación de una ejecución real.
6. Lanzar Notebook por primera vez y de nuevo, comprobar HTTP local y kernel del entorno, y detener los procesos propios. Registrar comandos y resultados en tareas.
