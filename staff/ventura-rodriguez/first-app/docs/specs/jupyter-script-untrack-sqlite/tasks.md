# Tareas — script de Jupyter y base fuera de git

1. Abrir `package.json` y `scripts/start-jupyter.js`.
   El script `jupyter` es `node scripts/start-jupyter.js`.
   El arranque que hay que conservar está en el plan.

2. Crear `scripts/jupyter.sh` en la raíz de first-app.
   Hace el arranque del plan y entra en esa raíz.
   El fichero se puede ejecutar.

3. Eliminar `scripts/start-jupyter.js`.
   Dejar el script `jupyter` de `package.json` en `sh scripts/jupyter.sh`.
   El script `test` se queda.

4. Dejar de versionar `db/users.sqlite`.
   El fichero sigue en el disco.
   El `.gitignore` de la raíz ignora esa base y sus `journal`, `wal` y `shm`.
   El comentario deja fuera la base de Ventura, además de la de Esther.

5. Comprobar que `pnpm run jupyter` lanza `scripts/jupyter.sh` y enseña los nueve notebooks.
   Comprobar que `scripts/start-jupyter.js` no existe.
   Comprobar que `db/users.sqlite` no está en git y sigue en el disco.
   Parar el servidor al terminar.
