# Plan: Cliente Jupyter

Implementa [spec.md](spec.md). Todo respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md): sin cambios de esquema, sin tocar `logic/`, `queries/` ni `db/`.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Ejecución | Bloque Python con `subprocess.run(["node", "--no-warnings", "--input-type=module", "-e", code], cwd=app, capture_output=True, text=True, encoding="utf-8", env=env)`. El `code` de Node importa la función de `logic/` y dibuja la tabla | Los datos llegan como objetos y se pueden dibujar en tabla. El UTF-8 evita el `UnicodeDecodeError` de `cp1252` en Windows |
| Importar `logic/` | Se importa la función tal cual. Depende de #638: los archivos de `logic/` solo exportan su función | Con el bloque `isRunFromTerminal`, importar desde `node -e` fallaba porque `process.argv[1]` no existe |
| Colores | `env` es una copia del entorno con `FORCE_COLOR=1` y sin `NO_COLOR` | La salida no va a una terminal, y sin esto Node no pinta el encabezado |
| Resultado guardado | Cada documento se guarda con la salida de su ejecución, con los valores de ejemplo tal cual. Orden: `updateUser`, `deleteUser`, `createUser`, `findUserByEmail`, `listUsers`, `classifyGender`. Cambia y borra el usuario 3 y vuelve a crear a Pedro con otro id, con permiso del usuario | La spec pide que el documento traiga el resultado. En ese orden todos los ejemplos funcionan |
| Localizar la app | Subir desde `Path.cwd()` hasta la carpeta que contiene `logic/`. Si no se encuentra, `SystemExit("App not found.")` | El documento funciona desde `clients/jupyter/` sin rutas fijas |
| Errores | Si el programa termina con error, se imprime su salida de error (`Error: <mensaje>`) y no sale la tabla | Se ve el mensaje que ya lanza `logic/` |
| Tabla | La dibuja Node con `cli-table3` `0.6.5`. El encabezado va en color (`cyan`, `bold`) con `@colors/colors` `1.6.1`. Versiones fijas, instaladas con pnpm | Mismo resultado que el cliente de Ventura. Dependencias aprobadas por el usuario (`AGENTS.md` pide permiso) |
| Datos | Cada documento llama a la `logic/` existente | Constitución §1: flujo `terminal → logic → queries → db` |
| Estructura | `clients/jupyter/<operación>.ipynb`, mismo nombre que `logic/<operación>.js` | Constitución §2 |
| Cómo abrirlo | VS Code con la extensión Jupyter y el kernel de Python con `ipykernel`. Alternativa: `python -m notebook clients/jupyter` | Ya instalado en el equipo. No depende de `.venv/bin`, que no existe en Windows |
| Constitución | §2 añade que una operación tiene también un `.ipynb` en `clients/jupyter/`. Versión 1.2.0 | Aprobado por el usuario |

## Arquitectura
```
clients/terminal/   .txt con los comandos (SIN cambios)
clients/jupyter/    un .ipynb por operación (NUEVO)
logic/              SIN cambios
queries/            SIN cambios
db/                 SIN cambios
```
Se crean 6 archivos `.ipynb`. Cambian `package.json` (dos dependencias) y `pnpm-lock.yaml` (nuevo). `node_modules/` no se sube: lo ignora el `.gitignore` de la raíz. No se modifica ningún otro archivo de la app.

## Diseño de cada documento
Un markdown con las cuatro partes de la spec y un bloque de código con la misma forma:
1. Subir de carpeta hasta encontrar `logic/`.
2. Lanzar `node --no-warnings --input-type=module -e <código>` desde la app. El código importa la función de `logic/<operación>.js`, la llama con los valores de ejemplo y dibuja la tabla con `cli-table3`. La salida se lee en UTF-8.
3. Si termina bien, mostrar la tabla. Si termina con error, mostrar el mensaje que lanza `logic/`.

Columnas de un usuario, en este orden: `id`, `name`, `email`, `created_at`, `updated_at`. Una lista es una fila por usuario. `deleteUser` no devuelve el usuario: la tabla tiene la columna `Result` y la fila `User deleted: id <id>`, igual que la terminal. El conteo de `classifyGender` usa las columnas `Men`, `Women` y `Undefined`.

Valores de ejemplo, tomados de los `.txt`. Es el mismo comportamiento que el comando de terminal, pero se llama a la función exportada en lugar de ejecutar el archivo:

| Documento | Valores | Escribe en la base | Notas |
|---|---|---|---|
| `listUsers` | sin argumentos | No | Sin usuarios: `There are no users yet.` |
| `findUserByEmail` | `pedro@gmail.com` | No | Sin coincidencia: `User not found` |
| `createUser` | `Pedro`, `pedro@gmail.com` | Sí | El email se guarda en minúsculas |
| `updateUser` | id `3`, `Pedro Garcia`, `""` | Sí | `""` deja ese campo sin cambiar |
| `deleteUser` | id `3` | Sí | Borra al usuario indicado |
| `classifyGender` | sin argumentos | No | Necesita Ollama en marcha |

## Cómo se prueba
Con los comandos reales, incluidos los casos de error de la spec. Los usuarios de prueba se borran siempre al terminar.
