# Spec — automatizar git en el Mac

La app sigue igual: desde la terminal se guardan personas en SQLite. Este cambio no añade ni quita ninguna acción.

Entra un momento del flujo de git del curso: pensar la tarea, dejarla escrita, empezar, guardar un trozo o pedir revisión. Sale el paso de ese momento, hecho en la terminal del Mac, dentro de `staff/meghan-martin/first-app`.

La rama sale de `staging` y se llama `número-tipo-descripcion`. La pull request queda en draft, con base `staging`. Enlazar la issue no la cierra.

## Few-shot

- Desde la raíz del repositorio se lanza `staff/meghan-martin/first-app/tools/check-status.sh`. Termina bien y escribe el repositorio, la rama y el remoto.
- Se pide empezar una tarea de prueba. La rama sale de `staging` y el nombre es `número-tipo-descripcion`.
- La pull request queda en draft, con base `staging`. El enlace con la issue no la cierra.
- El mismo script se lanza desde `first-app`. Hace el mismo trabajo.
- Hay un commit o un push en `main` o en `staging`. No se hace.
- Un fichero sin seguimiento no choca con la otra rama. Sigue ahí. No se mete en el commit si no se nombró.
