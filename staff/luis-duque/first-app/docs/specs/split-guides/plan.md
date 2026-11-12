# Plan — separar las guías

Cumple `docs/specs/split-guides/spec.md`.

No hay función nueva, ni SQL, ni cliente. La aplicación sigue igual. No se añade ningún paquete.

## Ficheros

Se crean, en `docs/`:

- `ARCHITECTURE.md`. Recibe la presentación de la app y «Componentes».
- `TREE.md`. Recibe «Estructura». El árbol incluye estos cinco ficheros.
- `DATABASE.md`. Recibe lo que la constitución dice de la base y de las consultas, y el resultado de crear, actualizar, eliminar, listar y buscar.
- `ERRORS.md`. Recibe los fallos que la constitución ya nombra.
- `STYLE.md`. Recibe «Cómo nombrar» y «Cómo escribir el código», que salen de `AGENTS.MD`.

Se toca `docs/CONSTITUTIONS.MD`. Se queda con «Desarrollos», «Paquetes» y los cuatro pasos numerados de «Pasos de funcionamiento». Enlaza a los cinco ficheros. El resto de «Pasos de funcionamiento» sale de ahí. La línea del desarrollo abierto se queda igual. El fichero no se renombra.

Se toca `AGENTS.MD`. Se queda con el proceso SDD, en «Desarrollos», y con las secciones que no son estilo. «Cómo nombrar» y «Cómo escribir el código» pasan a `docs/STYLE.md`. Enlaza a `docs/STYLE.md`. «Qué documentos mantienes» dice que la constitución se queda con las specs, los paquetes y los cuatro pasos, y que el estilo está en `docs/STYLE.md`.

No se toca `package.json`, `pnpm-lock.yaml`, `logic`, `queries`, `db` ni `clients`. No se toca el `AGENTS.md` de la raíz del repositorio.

El texto se mueve. No se añaden reglas nuevas.
