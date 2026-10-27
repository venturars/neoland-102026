# Tareas — separar las guías

1. Crea `docs/ARCHITECTURE.md`.
   Lleva la presentación de la app y «Componentes», el texto que ya está en la constitución.
   No añade reglas nuevas.
   El fichero se puede leer.

2. Crea `docs/TREE.md`.
   Lleva «Estructura». El árbol incluye `ARCHITECTURE.md`, `TREE.md`, `DATABASE.md`, `ERRORS.md` y `STYLE.md`.
   No añade carpetas que no existan.
   El fichero se puede leer.

3. Crea `docs/DATABASE.md`.
   Lleva lo que la constitución dice de la base y de las consultas, y el resultado de crear, actualizar, eliminar, listar y buscar.
   No añade reglas nuevas.
   El fichero se puede leer.

4. Crea `docs/ERRORS.md`.
   Lleva los fallos que la constitución ya nombra.
   No inventa fallos nuevos.
   El fichero se puede leer.

5. Crea `docs/STYLE.md`.
   Lleva «Cómo nombrar» y «Cómo escribir el código», el texto que sale de `AGENTS.MD`.
   No añade reglas nuevas.
   El fichero se puede leer.

6. Abre `docs/CONSTITUTIONS.MD`.
   Se queda con «Desarrollos», «Paquetes» y los cuatro pasos numerados de «Pasos de funcionamiento».
   Enlaza a los cinco ficheros. El resto de «Pasos de funcionamiento» sale. La línea del desarrollo abierto se queda igual.
   No se renombra.

7. Abre `AGENTS.MD`.
   Se queda con el proceso SDD en «Desarrollos» y con las secciones que no son estilo.
   «Cómo nombrar» y «Cómo escribir el código» pasan a `docs/STYLE.md`, y este fichero enlaza ahí.
   «Qué documentos mantienes» dice que la constitución se queda con las specs, los paquetes y los cuatro pasos, y que el estilo está en `docs/STYLE.md`.

8. Lee `docs/CONSTITUTIONS.MD`, `AGENTS.MD` y los cinco ficheros.
   La constitución enlaza a los cinco y conserva las specs, los paquetes y los cuatro pasos.
   `AGENTS.MD` conserva el proceso SDD y enlaza a `docs/STYLE.md`.
   `package.json`, `logic`, `queries`, `db` y `clients` siguen igual.
