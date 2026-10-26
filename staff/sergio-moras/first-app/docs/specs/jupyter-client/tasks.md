# Tasks: Cliente Jupyter

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden**.

## Reglas de ejecución
- Una tarea cada vez. Al terminar cada una se enseña el resultado y se espera el sí antes de seguir con la siguiente.
- Se crean los 6 archivos `.ipynb` de `clients/jupyter/` y se añaden las dependencias de la tabla (`package.json` y `pnpm-lock.yaml`). No se toca nada más: ni `logic/`, ni `queries/`, ni `db/`, ni `AGENTS.md`, ni `CONSTITUTIONS.md`.
- Nombres y mensajes en inglés; textos explicativos del documento en español.
- Los usuarios de prueba usan el email `tmp-jupyter-<n>@example.com` y se borran siempre al terminar. Nunca se borra ni se reinicia `db/users.sqlite`.
- Si el plan no cubre un caso, no se improvisa: se para y se pregunta.

## T1. Foto inicial
- [ ] Ejecutar `node --no-warnings logic/listUsers.js` y guardar la salida como foto inicial de los datos.

## T2. Añadir las dependencias de la tabla
- [ ] Instalar con pnpm `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`, versiones fijas.
- [ ] Comprobar que `package.json` solo gana esas dos dependencias, que existe `pnpm-lock.yaml` y que `node_modules/` no aparece en `git status`.

## T3. Crear `clients/jupyter/listUsers.ipynb`
- [ ] Markdown con las cuatro partes de la spec.
- [ ] Bloque que sube hasta `logic/`, llama a `listUsers` y dibuja la tabla con `cli-table3`, con la salida en UTF-8.
- [ ] Probar: con usuarios, y desde una carpeta sin la app (`App not found.`).

## T4. Crear `clients/jupyter/findUserByEmail.ipynb`
- [ ] Mismo diseño, con `pedro@gmail.com`.
- [ ] Probar: email que existe, email que no existe, email vacío.

## T5. Crear `clients/jupyter/createUser.ipynb`
- [ ] Mismo diseño, con una anotación que avisa de que escribe en la base.
- [ ] Probar con un usuario temporal: alta correcta, nombre vacío, email vacío, email inválido y email repetido.

## T6. Crear `clients/jupyter/updateUser.ipynb`
- [ ] Mismo diseño, con una anotación de que escribe en la base y de que `""` deja el campo sin cambiar.
- [ ] Probar sobre el usuario temporal: cambiar nombre, cambiar email, id inexistente, id no numérico y sin datos nuevos.

## T7. Crear `clients/jupyter/deleteUser.ipynb`
- [ ] Mismo diseño, con una anotación de que borra al usuario indicado.
- [ ] Probar borrando el usuario temporal, y con un id inexistente y uno no numérico.

## T8. Crear `clients/jupyter/classifyGender.ipynb`
- [ ] Mismo diseño, con una anotación de que necesita Ollama en marcha.
- [ ] Probar con Ollama en marcha y con Ollama apagado.

## T9. Comprobación final y resumen
- [ ] Ejecutar `node --no-warnings logic/listUsers.js` y comprobar que coincide con la foto inicial de T1.
- [ ] Comprobar que no queda ningún usuario `tmp-jupyter-*`.
- [ ] Enseñar un resumen con los archivos creados y lo probado.
- [ ] Proponer, sin editarla, la línea de la constitución que recoge `clients/jupyter/`.
