# Tareas — guías SDD separadas por tema

1. Crear `docs/TREE.md`.
   El texto es el del apartado «Árbol» del plan.
   El fichero solo tiene el árbol.
   No tiene frases de responsabilidad.

2. Crear `docs/ARCHITECTURE.md`.
   El texto es el del apartado «Arquitectura» del plan.
   Dice qué hace cada capa y cada fichero.
   No repite el árbol.

3. Crear `docs/DATABASE.md`.
   El texto es el del apartado «Base de datos» del plan.
   La base de datos y las queries están en ese fichero.
   El texto es el que ya había.

4. Crear `docs/ERRORS.md`.
   El texto es el del apartado «Errores» del plan.
   La lista y las reglas de uso están en ese fichero.
   No se toca `logic/errors.js`.

5. Crear `docs/STYLE.md`.
   El texto es el del apartado «Estilo» del plan.
   Conserva las convenciones y la regla de la línea.
   La excepción de clases apunta a `logic/errors.js`.

6. Abrir `docs/CONSTITUTIONS.md`.
   Quitar Árbol, Base de datos, Queries y Errores.
   Añadir «Guías», el bullet nuevo del `plan.md` y las frases en «Un fichero logic».
   Specs, Paquetes, Logic no se reemplaza y los cuatro pasos siguen igual.

7. Abrir `AGENTS.md` de first-app.
   El proyecto, el estilo y las reglas quedan como dice el plan.
   Orden, Paquetes, Comandos y «Al terminar una tarea» siguen igual.
   No se toca el `AGENTS.md` de la raíz del bootcamp.

8. Comprobar las guías.
   Cada tema está en un solo fichero.
   El árbol no explica responsabilidades.
   `git diff` no incluye `logic/`, `queries/`, `db/` ni `clients/`.
