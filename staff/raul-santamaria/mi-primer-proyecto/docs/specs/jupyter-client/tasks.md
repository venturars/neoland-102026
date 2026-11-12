# Tareas — cliente Jupyter

Un paso. Quien lo revisa marca `- [x]`.

- [ ] 1. Abrir `docs/CONSTITUTIONS.md`, en el árbol de `clients/`.
  La línea de `jupyter/` dice que se abre con el Jupyter de la app.
  En «Paquetes» están `openai`, `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`.

- [ ] 2. Abrir `package.json` y `start-jupyter.js`.
  El script `jupyter` es `node start-jupyter.js`.
  La primera vez crea `.venv` si falta, instala `notebook==7.6.3` si falta el ejecutable, y arranca Jupyter Notebook en `clients/jupyter`.
  En Windows usa `.venv/Scripts/`; en Unix, `.venv/bin/`. No arranca Lab.

- [ ] 3. Abrir `clients/jupyter/create-user.ipynb`.
  El markdown lleva título, qué hace, qué pasa en la base de datos, qué acción usa y las anotaciones del plan.
  El bloque ejecuta `createUser({ name: "Ada", email: "ada@example.com" })`, dibuja las columnas de un usuario y sube hasta `logic/`.
  Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

- [ ] 4. Abrir `clients/jupyter/list-users.ipynb`.
  El markdown lleva las cuatro partes del plan para este documento.
  El bloque ejecuta `listUsers()`, dibuja una fila por usuario y, si la lista está vacía, la línea `No hay filas.`

- [ ] 5. Abrir `clients/jupyter/update-user.ipynb`.
  El markdown lleva las cuatro partes del plan para este documento.
  El bloque ejecuta `updateUser({ id: 1, name: "Ada Lovelace" })` y dibuja las columnas de un usuario.

- [ ] 6. Abrir `clients/jupyter/delete-user.ipynb`.
  El markdown lleva las cuatro partes del plan para este documento.
  El bloque ejecuta `deleteUser({ id: 1 })` y, si no hay datos, dibuja `No devuelve datos.`

- [ ] 7. Abrir `clients/jupyter/users-gender-count.ipynb`.
  El markdown lleva las cuatro partes del plan para este documento.
  El bloque ejecuta `await usersGenderCount()` y dibuja `women`, `men` y `genderUndefined`.

- [ ] 8. Ejecutar el bloque de cada documento con el directorio en `clients/jupyter`.
  La salida guardada es la tabla, `No hay filas.`, o el mensaje de error. No se reescribe a mano.

- [ ] 9. Lanzar `pnpm jupyter` desde `mi-primer-proyecto`.
  El navegador muestra los cinco documentos, en la interfaz de notebooks. No se abre Lab.
